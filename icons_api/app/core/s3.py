from __future__ import annotations

import datetime
from typing import TYPE_CHECKING

from loguru import logger

from ..utils.hmac import *

if TYPE_CHECKING:
    from ..app import Application

__all__ = ("upload_object", "get_object", "delete_object", "generate_presigned_url")


async def upload_object(
    app: Application,
    object_name: str,
    file: bytes,
):
    """Upload a file to an the bucket."""
    logger.info(f"[S3] Uploading {object_name} to S3 bucket {app.state.settings.s3_bucket_name}...")
    return await app.state.s3.put_object(
        Bucket=app.state.settings.s3_bucket_name,
        Key=object_name,
        Body=file,
    )


async def get_object(
    app: Application,
    object_name: str,
):
    """Get a file from the S3 bucket."""
    return await app.state.s3.get_object(
        Bucket=app.state.settings.s3_bucket_name,
        Key=object_name,
    )


async def delete_object(
    app: Application,
    object_name: str,
) -> None:
    """Delete a file from the S3 bucket."""
    logger.info(f"[S3] Deleting {object_name} from S3 bucket {app.state.settings.s3_bucket_name}...")
    try:
        await app.state.s3.delete_object(
            Bucket=app.state.settings.s3_bucket_name,
            Key=object_name,
        )
    except Exception as e:
        logger.error(f"[S3] Failed to delete {object_name} from S3 bucket {app.state.settings.s3_bucket_name}: {e}")


async def generate_presigned_url(
    app: Application,
    object_name: str,
    expiration: datetime.timedelta = datetime.timedelta(days=1),
) -> str:
    """Generate a presigned URL to share an S3 object."""
    return await app.state.s3.generate_presigned_url(
        "get_object",
        # Ensure the browser always downloads the file even if it's e.g. a PDF
        Params={"Bucket": app.state.settings.s3_bucket_name, "Key": object_name, "ResponseContentDisposition": "attachment"},
        ExpiresIn=int(expiration.total_seconds()),
    )
