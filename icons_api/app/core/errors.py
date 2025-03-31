from __future__ import annotations

from typing import Union, TYPE_CHECKING

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.openapi.constants import REF_PREFIX
from fastapi.openapi.utils import validation_error_response_definition
from pydantic import ValidationError
from slowapi.errors import RateLimitExceeded
from starlette.responses import JSONResponse
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY

if TYPE_CHECKING:
    from ..request import Request

__all__ = (
    "CustomValidationError",
    "setup_errors",
)


class CustomValidationError(Exception):
    def __init__(self, errors: str | list[str], status_code: int = 400) -> None:
        self.errors = errors if isinstance(errors, list) else [errors]
        self.status_code = status_code


async def http_error_handler(_: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse({"errors": [exc.detail]}, status_code=exc.status_code)


async def http422_error_handler(
    _: Request,
    exc: Union[RequestValidationError, ValidationError],
) -> JSONResponse:
    return JSONResponse(
        {"errors": exc.errors()},
        status_code=HTTP_422_UNPROCESSABLE_ENTITY,
    )


async def http429_error_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    response = JSONResponse({"errors": [f"Rate limit exceeded: {exc.detail}"]}, status_code=429)
    response = request.app.state.limiter._inject_headers(response, request.state.view_rate_limit)
    return response


async def custom_error_handler(_: Request, exc: CustomValidationError) -> JSONResponse:
    return JSONResponse({"errors": exc.errors}, status_code=exc.status_code)


validation_error_response_definition["properties"] = {
    "errors": {
        "title": "Errors",
        "type": "array",
        "items": {"$ref": "{0}ValidationError".format(REF_PREFIX)},
    },
}


def setup_errors(app: FastAPI) -> None:
    app.add_exception_handler(HTTPException, http_error_handler)  # type: ignore
    app.add_exception_handler(RequestValidationError, http422_error_handler)  # type: ignore
    app.add_exception_handler(CustomValidationError, custom_error_handler)  # type: ignore
    app.add_exception_handler(RateLimitExceeded, http429_error_handler)  # type: ignore
