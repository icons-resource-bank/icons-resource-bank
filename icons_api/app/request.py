from typing import TYPE_CHECKING

from fastapi import Request as FastAPIRequest

if TYPE_CHECKING:
    from .api.managers import *
    from .app import Application

    class RequestState:
        user: User | None

    class AuthedRequestState(RequestState):
        user: User

    class Request(FastAPIRequest):
        app: Application
        state: RequestState

    class AuthedRequest(FastAPIRequest):
        app: Application
        state: AuthedRequestState

else:
    Request = AuthedRequest = FastAPIRequest


__all__ = ("Request", "AuthedRequest")
