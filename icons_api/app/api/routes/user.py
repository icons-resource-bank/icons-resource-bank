from typing import Annotated

from fastapi import APIRouter, Request, Query

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...utils.decorators import *
from ..managers.user import User
from ..models.user import UserRequest
from ...request import Request

__all__ = ("setup",)


router = APIRouter(prefix="/users")


@router.get("")
@limiter.limit("10/5 seconds")
@flag_check(staff=True)
async def get_users(
    request: Request,
    limit: Annotated[int, Query(ge=0, le=100)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
    search: Annotated[str | None, Query(max_length=255)] = None,
    sort_by: Annotated[str, Query(pattern=r"^(name|created_at)$")] = "created_at",
    sort_order: Annotated[str, Query(pattern=r"^(asc|desc)$")] = "desc",
    flags: int | None = None,
):
    users, total = await request.app.state.users.get_all(
        limit=limit, offset=offset, search=search, sort_by=f"{sort_by} {sort_order.upper()}", flags=flags, with_total=True
    )
    return {
        "total": total,
        "users": [user.to_dict() for user in users],
    }


@router.get("/@me")
@auth_check
async def get_me(request: Request):
    return request.state.user.to_dict()  # type: ignore


@router.get("/{id}")
@limiter.limit("30/5 seconds")
@auth_check
async def get_user(request: Request, id: str):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)
    return user.to_dict()


@router.patch("/@me")
@limiter.limit("5/5 seconds")
@ban_check
async def update_me(request: Request, data: UserRequest):
    user: User = request.state.user  # type: ignore
    if data.name is not None:
        user = await request.app.state.users.update(id=user.id, name=data.name)

    return user.to_dict()


@router.patch("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def update_user(request: Request, id: str, data: UserRequest):
    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)

    user = await request.app.state.users.update(id=user.id, **{k: v for k, v in data.model_dump().items() if v is not None})
    return user.to_dict()


def setup(api: APIRouter):
    api.include_router(router, tags=["users"])
