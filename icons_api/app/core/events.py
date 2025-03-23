from __future__ import annotations

from typing import TYPE_CHECKING, Awaitable, Callable

import aiohttp
from loguru import logger

from ..api.managers.user import UserManager
from ..db.events import close_db_connection, connect_to_db
from ..s3.events import close_s3_connection, connect_to_s3
from .auth import setup_oauth2

if TYPE_CHECKING:
    from ..app import Application
    from .settings import Settings


def create_start_app_handler(app: Application, settings: Settings) -> Callable[[], Awaitable[None]]:
    async def start_app() -> None:
        app.state.session = aiohttp.ClientSession(connector=aiohttp.TCPConnector(limit=0))
        app.state.users = UserManager(app)
        await connect_to_db(app, settings)
        await connect_to_s3(app, settings)
        await setup_oauth2(app)

    return start_app


def create_stop_app_handler(app: Application) -> Callable[[], Awaitable[None]]:
    @logger.catch
    async def stop_app() -> None:
        await close_db_connection(app)
        await close_s3_connection(app)
        await app.state.session.close()

    return stop_app
