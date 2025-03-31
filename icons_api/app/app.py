from typing import TYPE_CHECKING

from fastapi import FastAPI

from .core.errors import setup_errors
from .api.routes.api import router as api_router
from .core.config import get_app_settings
from .core.events import create_start_app_handler, create_stop_app_handler
from .core.middleware import setup_middleware

if TYPE_CHECKING:
    from types_aiobotocore_s3 import S3Client
    from aiohttp import ClientSession
    from asyncpg import Pool
    from slowapi import Limiter

    from .api.managers import *
    from .core.settings import Settings

    class ApplicationState:
        pool: Pool
        s3: S3Client
        session: ClientSession
        settings: Settings

        # Rate limiting
        limiter: Limiter
        view_rate_limit: str | None
        rate_limit_exceeded: str | None

        # Managers
        courses: CourseManager
        resources: ResourceManager
        users: UserManager

        # Microsoft
        openid_keys: list[dict[str, str]]

    class Application(FastAPI):
        state: ApplicationState

else:
    Application = FastAPI


__all__ = (
    "Application",
    "app",
    "limiter",
)


def get_application() -> Application:
    settings = get_app_settings()

    settings.configure_logging()

    application = Application(**settings.fastapi_kwargs)
    application.state.settings = settings

    setup_middleware(application)
    setup_errors(application)

    application.add_event_handler(
        "startup",
        create_start_app_handler(application, settings),
    )
    application.add_event_handler(
        "shutdown",
        create_stop_app_handler(application),
    )

    application.include_router(api_router, prefix="/api")

    return application


app = get_application()
limiter = app.state.limiter
