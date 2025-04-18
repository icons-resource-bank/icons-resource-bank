from typing import Annotated, Literal

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...request import AuthedRequest
from ...utils.decorators import *
from ..managers.user import User, UserFlags
from ..models.user import *

__all__ = ("setup",)


router = APIRouter(prefix="/users")


@router.get("")
@limiter.limit("10/5 seconds")
@flag_check(staff=True)
async def get_users(
    request: AuthedRequest,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
    query: Annotated[str | None, Query(max_length=255)] = None,
    name: Annotated[str | None, Query(max_length=255)] = None,
    email: Annotated[str | None, Query(max_length=255)] = None,
    sort_by: Annotated[Literal["query", "created_at"], Query(max_length=255)] = "query",
    sort_order: Annotated[Literal["asc", "desc"], Query(max_length=255)] = "desc",
    flags: int | None = None,
):
    users, total = await request.app.state.users.query(
        limit=limit,
        offset=offset or 0,
        query=query,
        name=name,
        email=email,
        sort_by=f"{sort_by} {sort_order.upper()}",
        flags=UserFlags(flags) if flags else None,
    )
    return JSONResponse(
        {
            "total": total,
            "items": [user.to_dict() for user in users],
        }
    )


@router.get("/@me")
@auth_check
async def get_me(request: AuthedRequest):
    return JSONResponse(request.state.user.to_dict())


@router.get("/@me/settings")
@auth_check
async def get_me_settings(request: AuthedRequest):
    return JSONResponse(await request.app.state.users.get_settings(request.state.user.id)) 


@router.get("/{id}")
@limiter.limit("30/5 seconds")
@auth_check
async def get_user(request: AuthedRequest, id: str):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)
    return JSONResponse(user.to_dict())


@router.patch("/@me")
@limiter.limit("5/5 seconds")
@ban_check
async def update_me(request: AuthedRequest, data: UserRequest):
    user: User = request.state.user
    if data.name is not None:
        user = await request.app.state.users.update(id=user.id, name=data.name)

    return JSONResponse(user.to_dict())


@router.patch("/@me/settings")
@limiter.limit("5/5 seconds")
@auth_check
async def update_me_settings(request: AuthedRequest, data: UserSettingsRequest):
    settings = await request.app.state.users.update_settings(**{k: v for k, v in data.model_dump().items() if v is not None})
    return JSONResponse(settings.to_dict())


@router.patch("/@me/consent")
@limiter.limit("5/5 seconds")
@auth_check
async def update_me_consent(request: AuthedRequest, data: ConsentRequest):
    ret = await request.state.user.set_flag(UserFlags.analytics_opt_out, not data.analytics)
    return JSONResponse(ret.to_dict())


@router.patch("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def update_user(request: AuthedRequest, id: str, data: UserRequest):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)

    user = await request.app.state.users.update(id=user.id, **{k: v for k, v in data.model_dump().items() if v is not None})
    return JSONResponse(user.to_dict())


@router.post("/{id}/ban")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def ban_user(request: AuthedRequest, id: str, data: BanRequest):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)

    if user.has_flag(UserFlags.banned):
        raise CustomValidationError("User is already permabanned", 400)

    if user.has_flag(UserFlags.admin) or user.has_flag(UserFlags.staff):
        raise CustomValidationError("Cannot ban staff", 403)

    if not data.until:
        user = await user.set_flag(UserFlags.banned, True)
    else:
        # Temp banned users should not have the flag set
        user = await request.app.state.users.update(id=user.id, temp_banned_until=data.until)
    return JSONResponse(user.to_dict())


@router.delete("/{id}/ban")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def unban_user(request: AuthedRequest, id: str):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)

    await request.app.state.users.update(id=user.id, temp_banned_until=None, flags=user.flags & ~UserFlags.banned)
    return JSONResponse(user.to_dict())


def setup(api: APIRouter):
    api.include_router(router, tags=["users"])
