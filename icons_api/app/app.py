from __future__ import annotations

from typing import TYPE_CHECKING

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware

from .api.errors import *
from .api.routes.api import router as api_router
from .core.config import get_app_settings
from .core.events import create_start_app_handler, create_stop_app_handler

if TYPE_CHECKING:
    from aiohttp import ClientSession
    from asyncpg import Pool

    from .api.managers.user import UserManager
    from .core.settings import Settings

__all__ = (
    "Application",
    "app",
)


class ApplicationState:
    pool: Pool
    session: ClientSession
    settings: Settings

    # Managers
    users: UserManager

    # Microsoft
    openid_keys: list[dict[str, str]]


class Application(FastAPI):
    state: ApplicationState  # type: ignore


def get_application() -> Application:
    settings = get_app_settings()

    settings.configure_logging()

    application = Application(**settings.fastapi_kwargs)
    application.state.settings = settings

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_event_handler(
        "startup",
        create_start_app_handler(application, settings),
    )
    application.add_event_handler(
        "shutdown",
        create_stop_app_handler(application),
    )

    application.add_exception_handler(HTTPException, http_error_handler)  # type: ignore
    application.add_exception_handler(RequestValidationError, http422_error_handler)  # type: ignore
    application.add_exception_handler(CustomValidationError, custom_error_handler)  # type: ignore

    application.include_router(api_router, prefix="/api")

    return application


app = get_application()
