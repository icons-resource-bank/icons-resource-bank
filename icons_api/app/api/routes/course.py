from fastapi import APIRouter, Response, Query
from fastapi.responses import JSONResponse

from typing import Annotated, Literal

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...utils.decorators import *
from ..models.course import *
from ...request import Request

__all__ = ("setup",)


router = APIRouter()


@router.get("/courses")
@limiter.limit("10/5 seconds")
@auth_check
async def get_courses(
    request: Request,
    limit: Annotated[int, Query(ge=0, le=100)] = 0,  # Default to all courses
    offset: Annotated[int, Query(ge=0)] = 0,
    query: Annotated[str | None, Query(max_length=4096)] = None,
    code: Annotated[str | None, Query(max_length=16)] = None,
    name: Annotated[str | None, Query(max_length=64)] = None,
    year_level: Annotated[int | None, Query(ge=1, le=4)] = None,
    category: Annotated[str | None, Query(max_length=64)] = None,
    icon: Annotated[str | None, Query(max_length=64)] = None,
    description: Annotated[str | None, Query(max_length=4096)] = None,
    sort_by: Annotated[Literal["query", "created_at", "code"], Query(max_length=255)] = "query",
    sort_order: Annotated[Literal["asc", "desc"], Query(max_length=255)] = "desc",
):
    courses, total = await request.app.state.courses.query_courses(
        limit=limit,
        offset=offset,
        query=query,
        code=code,
        name=name,
        year_level=year_level,
        category=category,
        icon=icon,
        description=description,
        sort_by=f"{sort_by} {sort_order.upper()}",
    )
    return JSONResponse({"items": [course.to_dict() for course in courses], "total": total})


@router.post("/courses")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def create_course(request: Request, data: CourseCreateRequest):
    course = await request.app.state.courses.create_course(**{k: v for k, v in data.model_dump().items() if v is not None})
    return JSONResponse(course.to_dict(), status_code=201)


@router.get("/courses/{id}")
@limiter.limit("10/5 seconds")
@auth_check
async def get_course(request: Request, id: str):
    course = await request.app.state.courses.get_course(id=id)
    if not course:
        raise CustomValidationError("Course not found", 404)

    data = course.to_dict()
    data["resource_count"] = await request.app.state.resources.get_count(course_id=course.id)
    return JSONResponse(data)


@router.patch("/courses/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def update_course(request: Request, id: str, data: CourseUpdateRequest):
    course = await request.app.state.courses.get_course(id=id)
    if not course:
        raise CustomValidationError("Course not found", 404)

    course = await request.app.state.courses.update_course(
        id=course.id, **{k: v for k, v in data.model_dump().items() if v is not None}
    )
    return JSONResponse(course.to_dict())


@router.delete("/courses/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def delete_course(request: Request, id: str):
    await request.app.state.courses.delete_course(id)
    return Response(status_code=204)


@router.get("/tags")
@limiter.limit("10/5 seconds")
@auth_check
async def get_tags(request: Request):
    return JSONResponse([tag.to_dict() for tag in await request.app.state.courses.get_tags()])


@router.post("/tags")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def create_tag(request: Request, data: TagCreateRequest):
    tag = await request.app.state.courses.create_tag(**data.model_dump())
    return JSONResponse(tag.to_dict(), status_code=201)


@router.get("/tags/{id}")
@limiter.limit("10/5 seconds")
@auth_check
async def get_tag(request: Request, id: str):
    tag = await request.app.state.courses.get_tag(id=id)
    if not tag:
        raise CustomValidationError("Tag not found", 404)

    data = tag.to_dict()
    data["resource_count"] = await request.app.state.resources.get_count(tag_id=tag.id)
    return JSONResponse(data)


@router.patch("/tags/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def update_tag(request: Request, id: str, data: TagUpdateRequest):
    tag = await request.app.state.courses.get_tag(id=id)
    if not tag:
        raise CustomValidationError("Tag not found", 404)

    _tag = await request.app.state.courses.update_tag(
        id=tag.id, **{k: v for k, v in data.model_dump().items() if v is not None}
    )
    return JSONResponse(_tag.to_dict())


@router.delete("/tags/{id}")
@limiter.limit("5/5 seconds")
@flag_check(admin=True)
async def delete_tag(request: Request, id: str):
    await request.app.state.courses.delete_tag(id)
    return Response(status_code=204)


def setup(api: APIRouter):
    api.include_router(router, tags=["courses", "tags"])
