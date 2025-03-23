from fastapi import APIRouter, Request

from ...core.auth import verify_token
from ..errors import CustomValidationError
from ..managers.user import UserFlags
from ..models.user import UserRequest

__all__ = ("setup",)


router = APIRouter(prefix="/users")


@router.get("/@me")
async def get_me(request: Request):
    try:
        user = await verify_token(request.app, request.headers.get("Authorization", "").removeprefix("Bearer "))
    except Exception:
        raise CustomValidationError("Unauthorized", 401)

    return user.to_dict()


@router.get("/{id}")
async def get_user(request: Request, id: str):
    try:
        await verify_token(request.app, request.headers.get("Authorization", "").removeprefix("Bearer "))
    except Exception:
        raise CustomValidationError("Unauthorized", 401)

    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)
    return user.to_dict()


@router.patch("/@me")
async def update_me(request: Request, data: UserRequest):
    try:
        user = await verify_token(request.app, request.headers.get("Authorization", "").removeprefix("Bearer "))
    except Exception:
        raise CustomValidationError("Unauthorized", 401)

    if data.name is not None:
        user = await request.app.state.users.update(id=user.id, name=data.name)

    return user.to_dict()


@router.patch("/{id}")
async def update_user(request: Request, id: str, data: UserRequest):
    try:
        me = await verify_token(request.app, request.headers.get("Authorization", "").removeprefix("Bearer "))
    except Exception:
        raise CustomValidationError("Unauthorized", 401)

    if not me.has_flag(UserFlags.admin):
        raise CustomValidationError("Insufficient permissions", 403)

    user = await request.app.state.users.get(id=id)
    if not user:
        raise CustomValidationError("User not found", 404)

    user = await request.app.state.users.update(id=user.id, **{k: v for k, v in data.model_dump().items() if v is not None})
    return user.to_dict()


def setup(api: APIRouter):
    api.include_router(router, tags=["users"])
