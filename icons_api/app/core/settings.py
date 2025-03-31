import logging
import sys
from enum import Enum
from typing import Any

from loguru import logger
from pydantic import PostgresDsn, SecretStr
from pydantic_settings import BaseSettings

from .logging import InterceptHandler

__all__ = (
    "Environment",
    "Settings",
    "DevSettings",
    "ProdSettings",
    "TestSettings",
)


class Environment(Enum):
    prod = "PRODUCTION"
    dev = "DEVELOPMENT"
    test = "TESTING"


class Settings(BaseSettings):
    app_env: Environment = Environment.prod
    debug: bool = True
    title: str = "iCons"
    version: str = "0.0.1"
    secret_key: SecretStr

    frontend_url: str
    s3_storage_url: str
    s3_bucket_name: str
    s3_client_id: str
    s3_client_secret: SecretStr
    database_uri: PostgresDsn
    max_connection_count: int = 25
    min_connection_count: int = 5

    microsoft_tenant_id: str
    microsoft_client_id: str
    microsoft_client_secret: SecretStr

    logging_level: int = logging.DEBUG
    loggers: tuple[str, str] = ("uvicorn.asgi", "uvicorn.access")

    class Config:
        env_file = ".env"
        validate_assignment = True
        extra = "allow"

    @property
    def fastapi_kwargs(self) -> dict[str, Any]:
        return {
            "debug": self.debug,
            "title": self.title,
            "version": self.version,
        }

    def configure_logging(self) -> None:
        logging.getLogger().handlers = [InterceptHandler()]
        for logger_name in self.loggers:
            logging_logger = logging.getLogger(logger_name)
            logging_logger.handlers = [InterceptHandler(level=self.logging_level)]

        logger.configure(
            handlers=[
                {"sink": sys.stderr, "level": self.logging_level},
                {"sink": "logs/app.log", "level": self.logging_level, "rotation": "1 day", "compression": "zip", "enqueue": True},
            ]
        )


class DevSettings(Settings):
    frontend_url: str = "http://localhost:3000"


class ProdSettings(Settings):
    debug: bool = False
    logging_level: int = logging.INFO


class TestSettings(Settings):
    debug: bool = True
    secret_key: SecretStr = SecretStr("test_secret")
    frontend_url: str = "http://localhost:3000"
    database_uri: PostgresDsn = PostgresDsn("postgresql://postgres:postgres@localhost:5432/postgres")
    logging_level: int = logging.DEBUG
