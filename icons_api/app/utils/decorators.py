from typing import Callable, TypeVar, Any, Awaitable
from functools import wraps

from . import utcnow
from ..core.errors import CustomValidationError
from ..api.managers.user import UserFlags
from ..request import Request

T = TypeVar("T", bound=Callable[..., Any])

__all__ = (
    "auth_check",
    "ban_check",
    "flag_check",
)


def auth_check(func: T) -> Callable[..., Awaitable[T]]:
    """Ensure authenticated API request."""

    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        if not request.state.user:
            raise CustomValidationError("Unauthorized", 401)
        return await func(request, *args, **kwargs)

    return wrapper


def ban_check(func: T) -> Callable[..., Awaitable[T]]:
    """Ensure non-banned API request."""

    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        user = request.state.user
        if not user:
            raise CustomValidationError("Unauthorized", 401)

        if user.is_banned():
            raise CustomValidationError(
                (
                    "Banned. " + f"Try again after {(user.temp_banned_until - utcnow()).days} days"
                    if user.temp_banned_until
                    else "Contact EngSoc"
                ),
                403,
            )
        return await func(request, *args, **kwargs)

    return wrapper


def flag_check(**flags: bool) -> Callable[..., Callable[..., Awaitable[Any]]]:
    """Ensure privileged API request."""
    for flag in flags:
        if not hasattr(UserFlags, flag):
            raise ValueError(f"Invalid user flag: {flag}")

    def decorator(func: T) -> Callable[..., Awaitable[T]]:
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            user = request.state.user
            if not user:
                raise CustomValidationError("Unauthorized", 401)
            for flag, value in flags.items():
                _flag = getattr(UserFlags, flag)
                if not user.has_flag(_flag) == value:
                    raise CustomValidationError(f"Insufficient permissions", 403)
            return await func(request, *args, **kwargs)

        return wrapper

    return decorator
