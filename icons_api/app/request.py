from typing import TYPE_CHECKING

from fastapi import Request as FastAPIRequest

if TYPE_CHECKING:
    from .api.managers import *
    from .app import Application

    class RequestState:
        user: User | None

    class Request(FastAPIRequest):
        app: Application
        state: RequestState

else:
    Request = FastAPIRequest


__all__ = ("Request",)
