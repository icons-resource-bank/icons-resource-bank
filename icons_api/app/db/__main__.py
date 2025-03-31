from __future__ import annotations

import asyncio
import pathlib
import re
import traceback
from datetime import date
from functools import cached_property, wraps
from typing import TYPE_CHECKING, Any, Callable, Coroutine, TypeVar

import asyncpg
import click

from ..core.config import get_app_settings

if TYPE_CHECKING:
    from typing_extensions import Self


class _Missing:
    __slots__ = ()

    def __eq__(self, other):
        return False

    def __bool__(self):
        return False

    def __hash__(self):
        return 0

    def __repr__(self):
        return ""


MISSING: Any = _Missing()
T = TypeVar("T")


class Migration:
    __slots__ = ("version", "name", "file")

    def __init__(self, version: int, name: str, file: pathlib.Path):
        self.version = version
        self.name = name
        self.file = file

    @classmethod
    def from_filename(cls, filename: str, /):
        version, _, name = filename.replace(".sql", "").partition("__")
        return cls(int(version), name, pathlib.Path(__file__).parent / "migrations" / filename)

    def __repr__(self):
        return f"<Migration version={self.version} name={self.name!r}>"


class DatabaseManager:
    def __init__(
        self, connection: asyncpg.Connection, directory: pathlib.Path = pathlib.Path(__file__).parent / "migrations"
    ):
        self.connection = connection
        self.directory = directory
        self._version: int = MISSING

    @classmethod
    async def from_uri(cls, uri: str, /) -> Self:
        connection = await asyncpg.connect(uri)
        return cls(connection)

    @cached_property
    def migrations(self) -> list[Migration]:
        return [Migration.from_filename(filename.name) for filename in sorted(self.directory.iterdir())]

    async def is_initialized(self) -> bool:
        return await self.current_version() > -1

    async def is_out_of_date(self) -> bool:
        return await self.current_version() < len(self.migrations) - 1

    async def current_version(self) -> int:
        if self._version is not MISSING:
            return self._version

        try:
            version = await self.connection.fetchval("SELECT version FROM schema ORDER BY version DESC LIMIT 1")
        except asyncpg.UndefinedTableError:
            version = -1
        else:
            if version is None:
                version = -1

        self._version = version
        return version

    async def apply(self, migration: Migration, /):
        await self.connection.execute(migration.file.read_text("utf-8"))
        await self.connection.execute("INSERT INTO schema (version) VALUES ($1) ON CONFLICT DO NOTHING", migration.version)
        self._version = migration.version

    async def migrate(self, to: int = -1, /, *, dry_run: bool = False, force: bool = False):
        connection = self.connection
        current_version = await self.current_version()
        if to < 0:
            to = len(self.migrations) - 1
        elif to < current_version and not force:
            raise ValueError("Cannot migrate to a version lower than the current version")
        elif to > len(self.migrations) - 1 and not force:
            raise ValueError("Cannot migrate to a version higher than the latest version")

        async with connection.transaction():
            if not force:
                migration_list = self.migrations[current_version + 1 : to + 1]
            else:
                # Apply only the selected migration
                migration_list = [self.migrations[to]]

            if not migration_list:
                click.secho("Database is already up to date.", fg="green")
                return

            for migration in migration_list:
                click.echo(f"Applying migration {migration.version} ({migration.name})...")
                await self.apply(migration)
            if dry_run:
                raise asyncio.CancelledError


def wrapped_coro(function: Callable[..., Coroutine[Any, Any, T]]) -> Callable[..., T]:
    async def managerize(*args: Any, **kwargs: Any) -> T:
        config = get_app_settings()
        manager = await DatabaseManager.from_uri(str(config.database_uri))
        return await function(manager, *args, **kwargs)

    @wraps(function)
    def wrapper(*args: Any, **kwargs: Any) -> T:
        return asyncio.run(managerize(*args, **kwargs))

    return wrapper


@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx: click.Context, /):
    if not ctx.invoked_subcommand:
        click.echo(ctx.get_help())


@cli.command()
@wrapped_coro
async def status(manager: DatabaseManager, /):
    """Shows information about the database."""
    version = await manager.current_version()
    if not await manager.is_initialized():
        click.secho("Database is not initialized.", fg="red")
    else:
        click.secho(f"Current version: {version}", fg="yellow" if await manager.is_out_of_date() else "green")
    if await manager.is_out_of_date():
        click.secho("Database is out of date (hint: use `app.db migrate`).", fg="yellow")


@cli.command()
@click.option("--list", "-l", is_flag=True, help="Lists all available migrations.")
@click.option("--dry-run", "--dry", "-d", is_flag=True, help="Performs a dry run, without actually applying the migrations.")
@click.option("--to", "-t", type=int, default=-1, help="The version to migrate to, or -1 for latest (default).")
@click.option("--force", "-f", is_flag=True, help="Forces the migration to run, even if the database is up to date.")
@wrapped_coro
async def migrate(manager: DatabaseManager, /, *, list: bool, dry_run: bool, to: int, force: bool):
    """Migrates the database to the specified version."""
    if list:
        current = to if to > -1 else await manager.current_version()

        click.secho("Available migrations:")
        for migration in manager.migrations:
            if migration.version < current:
                color = "green"
                prefix = "[✓] "
            elif migration.version == current:
                color = None
                prefix = "[→] "
            else:
                color = "red"
                prefix = "[ ] "

            click.secho(f"  {prefix}{migration.version} - {migration.name}", fg=color)
        return
    elif dry_run:
        click.secho("Performing dry run, no changes will be made.", fg="yellow")

    try:
        await manager.migrate(to, dry_run=dry_run, force=force)
    except ValueError as exc:
        click.secho(f"Invalid version specified: {exc}.", fg="red")
    except asyncio.CancelledError:
        if dry_run:
            click.secho("Dry run completed successfully.", fg="green")
        else:
            raise
    except Exception as exc:
        click.secho(f"Failed to migrate database.", fg="red")
        traceback.print_exc()
    else:
        click.secho("Successfully migrated database.", fg="green")


@cli.command()
@click.argument("query", type=str)
@wrapped_coro
async def execute(manager: DatabaseManager, /, query: str):
    """Executes a query on the database."""
    await manager.connection.execute(query)
    click.secho("Query executed.", fg="green")


@cli.command()
@click.argument("query", type=str)
@wrapped_coro
async def fetch(manager: DatabaseManager, /, query: str):
    """Fetches a query from the database."""
    result = await manager.connection.fetch(query)
    click.echo(result)


@cli.command()
@wrapped_coro
async def erase(manager: DatabaseManager, /):
    """Erases the database."""
    if click.confirm("Are you sure you want to erase the database?"):
        await manager.connection.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
        click.secho("Database erased.", fg="green")


@cli.command()
@click.option("--name", "-n", type=str, help="The name of the new migration.", required=True)
@click.option("--reason", "-r", type=str, help="The reason for the new migration.")
@wrapped_coro
async def revise(manager: DatabaseManager, /, *, name: str, reason: str | None):
    """Creates a new migration."""
    version = len(manager.migrations)
    migration = Migration(version, name, manager.directory / f'{version}__{re.sub(r"[^a-zA-Z0-9_]", "_", name).upper()}.sql')
    with migration.file.open("w", encoding="utf-8") as fp:
        fp.write(f"-- Version: {version}\n" f"-- Date: {date.today().isoformat()}\n" f"-- {reason or name}\n")

    if await manager.is_out_of_date():
        click.secho(
            "Database is out of date, please migrate before creating a new migration. Continue at your own risk.",
            fg="red",
        )
    click.secho(f"Created new migration {version} - {migration.name}.", fg="green")


cli()
