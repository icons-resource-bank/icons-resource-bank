from __future__ import annotations

from typing import TYPE_CHECKING

import aioboto3
import aiobotocore.session
from loguru import logger

if TYPE_CHECKING:
    from ..app import Application
    from ..core.settings import Settings

__all__ = ("connect_to_s3", "close_s3_connection")


async def connect_to_s3(app: Application, settings: Settings) -> None:
    logger.info("Connecting to S3...")

    botocore = aiobotocore.session.AioSession()
    botocore.set_config_variable("s3", {"endpoint_url": settings.s3_storage_url})
    botocore.set_config_variable("request_checksum_calculation", "WHEN_REQUIRED")
    botocore.set_config_variable("response_checksum_verification", "WHEN_REQUIRED")

    session = aioboto3.Session(
        settings.s3_client_id, settings.s3_client_secret.get_secret_value(), botocore_session=botocore
    )
    app.state.s3 = await session.client("s3").__aenter__()
    logger.info("S3 connection established")


async def close_s3_connection(app: Application) -> None:
    logger.info("Closing connection to S3...")
    await app.state.s3.__aexit__(None, None, None)
    logger.info("S3 connection closed")
