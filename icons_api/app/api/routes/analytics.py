from fastapi import APIRouter
from fastapi.responses import Response

from ...core.middleware import limiter
from ...request import AuthedRequest
from ...utils.decorators import *
from ..managers.user import User
from ..models.user import AnalyticsRequest

__all__ = ("setup",)


router = APIRouter()


@router.post("/track")
@limiter.limit("10/5 seconds")
@auth_check
async def track(request: AuthedRequest, body: AnalyticsRequest):
    user = request.state.user
    if user.can_track():
        await request.app.state.users.track(user, body.event, body.reference_id)

    # Silently drop banned/opted-out users
    return Response(status_code=204)


def setup(api: APIRouter):
    api.include_router(router, tags=["analytics"])
