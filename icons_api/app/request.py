from typing import TYPE_CHECKING

from fastapi import Request as FastAPIRequest

if TYPE_CHECKING:
    from .app import Application
    from .api.managers import *

    class RequestState:
        user: User | None

    class Request(FastAPIRequest):
        app: Application
        state: RequestState

else:
    Request = FastAPIRequest


__all__ = (
    "Request",
)
