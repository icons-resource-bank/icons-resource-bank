import base64
import hashlib
import hmac
import json
import time
from typing import Any
from urllib.parse import unquote

__all__ = ("sign", "verify")


def sign(key: str, data: Any) -> str:
    """Sign a dict with the secret key."""
    dumped = json.dumps(data, separators=(",", ":"), sort_keys=True)
    timestamp = hex(int(time.time()))[2:]
    signature = hmac.new(
        key.encode("utf-8"),
        dumped.encode("utf-8") + timestamp.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return f"{base64.b64encode(dumped.encode('utf-8')).decode('utf-8').rstrip('=')}.{timestamp}.{signature}"


def verify(key: str, token: str) -> Any | None:
    """Verify a signature."""
    try:
        data, timestamp, signature = token.split(".")
    except ValueError:
        return

    # Verify the data is proper JSON
    try:
        data = json.dumps(
            json.loads(base64.b64decode(data + "===").decode("utf-8")),
            separators=(",", ":"),
            sort_keys=True,
        )
    except Exception:
        return
    if hmac.new(
        key.encode("utf-8"),
        data.encode("utf-8") + timestamp.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest() == unquote(signature):
        return json.loads(data)
