from typing import Annotated

from fastapi import APIRouter, Request, Query
from fastapi.responses import JSONResponse, Response

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...utils.decorators import *
from ..models.user import *
from ...request import Request

__all__ = ("setup",)


router = APIRouter(prefix="/feedback")


@router.get("")
@limiter.limit("10/5 seconds")
@flag_check(staff=True)
async def get_feedbacks(
    request: Request,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
    query: Annotated[str | None, Query(max_length=1000)] = None,
):
    feedback, total = await request.app.state.users.query_feedback(limit=limit, offset=offset or 0, query=query)
    return JSONResponse(
        {
            "total": total,
            "items": [await fb.to_dict(with_data=True) for fb in feedback],
        }
    )


@router.get("/{id}")
@limiter.limit("30/5 seconds")
@flag_check(staff=True)
async def get_feedback(request: Request, id: str):
    fb = await request.app.state.users.get_feedback(id)
    if not fb:
        raise CustomValidationError("Feedback not found", 404)
    return JSONResponse(await fb.to_dict(with_data=True))


@router.delete("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def delete_feedback(request: Request, id: str):
    await request.app.state.users.delete_feedback(id)
    return Response(status_code=204)


@router.post("")
@limiter.limit("2/5 minutes")
@auth_check
async def post_feedback(request: Request, feedback: FeedbackRequest):
    user = request.state.user
    if not user.can_track():  # type: ignore
        raise CustomValidationError("Analytics are disabled", 403)

    fb = await request.app.state.users.create_feedback(user.id, feedback.comment)  # type: ignore
    return JSONResponse(await fb.to_dict())


def setup(api: APIRouter):
    api.include_router(router, tags=["feedback"])
