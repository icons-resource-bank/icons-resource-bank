from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING

import asyncpg
from loguru import logger

if TYPE_CHECKING:
    from ..app import Application
    from ..core.settings import Settings

__all__ = ("connect_to_db", "close_db_connection")


def encode_timestamp(value: datetime | None) -> str | None:
    # I really hate datetime handling in Python
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z") if value else None


async def db_init(conn: asyncpg.Connection) -> None:
    await conn.set_type_codec(
        "timestamptz", encoder=encode_timestamp, decoder=datetime.fromisoformat, schema="pg_catalog", format="text"
    )
    await conn.set_type_codec(
        "timestamp", encoder=encode_timestamp, decoder=datetime.fromisoformat, schema="pg_catalog", format="text"
    )
    await conn.execute("SET pg_trgm.similarity_threshold = 0.15")


async def connect_to_db(app: Application, settings: Settings) -> None:
    logger.info("Connecting to PostgreSQL...")
    app.state.pool = await asyncpg.create_pool(
        str(settings.database_uri),
        min_size=settings.min_connection_count,
        max_size=settings.max_connection_count,
        init=db_init,
        statement_cache_size=0,
    )
    logger.info("DB connection established")


async def close_db_connection(app: Application) -> None:
    await app.state.pool.close()
    logger.info("DB connection closed")
