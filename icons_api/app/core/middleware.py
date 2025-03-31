from __future__ import annotations

from typing import TYPE_CHECKING

from slowapi import Limiter

from starlette.middleware.cors import CORSMiddleware

from .auth import verify_token

if TYPE_CHECKING:
    from ..app import Application
    from ..request import Request

__all__ = ("setup_middleware", "limiter")


async def handle_authentication(request: Request, call_next):
    try:
        request.state.user = await verify_token(
            request.app, request.headers.get("Authorization", "").removeprefix("Bearer ")
        )
    except Exception:
        request.state.user = None

    response = await call_next(request)
    return response


def ratelimit_key(request: Request) -> str:
    if request.state.user:
        return str(request.state.user.id)

    ip = (
        request.headers.get("CF-Connecting-IP")
        or request.headers.get("X-Forwarded-For")
        or (request.client is not None and request.client.host)
    )
    if ip and "," in ip:
        return ip.split(",")[0].strip()
    return "127.0.0.1"


def setup_middleware(app: Application) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.middleware("http")(handle_authentication)

    app.state.limiter = limiter


limiter = Limiter(key_func=ratelimit_key, headers_enabled=True, application_limits=["30/second"])
