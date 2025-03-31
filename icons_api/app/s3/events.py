from __future__ import annotations

from typing import TYPE_CHECKING

import aioboto3
import aiobotocore.config
import aiobotocore.session
from loguru import logger

if TYPE_CHECKING:
    from ..app import Application
    from ..core.settings import Settings

__all__ = ("connect_to_s3", "close_s3_connection")


async def connect_to_s3(app: Application, settings: Settings) -> None:
    logger.info("Connecting to S3 storage bucket...")

    botocore = aiobotocore.session.AioSession()
    # Required for Cloudflare R2 compatibility
    botocore.set_config_variable("request_checksum_calculation", "WHEN_REQUIRED")
    botocore.set_config_variable("response_checksum_verification", "WHEN_REQUIRED")

    session = aioboto3.Session(
        settings.s3_client_id, settings.s3_client_secret.get_secret_value(), botocore_session=botocore
    )
    app.state.s3 = await session.client(
        "s3", endpoint_url=settings.s3_storage_url, config=aiobotocore.config.AioConfig(signature_version="s3v4")
    ).__aenter__()

    # Test S3 connection
    data = await app.state.s3.head_bucket(Bucket=settings.s3_bucket_name)
    logger.info(f"S3 connection established, region: {data['BucketRegion']}")


async def close_s3_connection(app: Application) -> None:
    await app.state.s3.__aexit__(None, None, None)
    logger.info("S3 connection closed")
