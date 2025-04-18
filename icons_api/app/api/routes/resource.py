from os import urandom
from typing import Annotated, Literal

import yarl
from fastapi import APIRouter, File, Form, Query, Response, UploadFile
from fastapi.responses import JSONResponse
from pydantic import AwareDatetime

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...core.s3 import *
from ...request import AuthedRequest
from ...utils.decorators import *
from ..managers.resource import ResourceType
from ..managers.user import UserFlags
from ..models.resource import *

__all__ = ("setup",)

router = APIRouter(prefix="/resources")


@router.get("")
@limiter.limit("10/5 seconds")
@auth_check
async def get_resources(
    request: AuthedRequest,
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
    query: Annotated[str | None, Query(max_length=4096)] = None,
    title: Annotated[str | None, Query(max_length=64)] = None,
    description: Annotated[str | None, Query(max_length=4096)] = None,
    type: ResourceType | None = None,
    course_ids: Annotated[list[str] | None, Query(max_length=255)] = None,
    author_ids: Annotated[list[str] | None, Query(max_length=255)] = None,
    tag_ids: Annotated[list[str] | None, Query(max_length=255)] = None,
    created_before: Annotated[AwareDatetime | None, Query(max_length=255)] = None,
    created_after: Annotated[AwareDatetime | None, Query(max_length=255)] = None,
    sort_by: Annotated[Literal["query", "created_at"], Query(max_length=255)] = "query",
    sort_order: Annotated[Literal["asc", "desc"], Query(max_length=255)] = "desc",
    ftype: Annotated[list[str] | None, Query(max_length=255)] = None,
    pending: bool = False,
):
    if pending and not request.state.user.has_flag(UserFlags.staff):
        raise CustomValidationError("You are not allowed to view pending resources", 403)

    if author_ids == [request.state.user.id]:
        pending = None  # type: ignore # typehack

    resources, total = await request.app.state.resources.query(
        limit=limit,
        offset=offset,
        query=query,
        sort_by=f"resources.{sort_by} {sort_order.upper()}",
        title=title,
        description=description,
        type=type,
        course_ids=course_ids,
        author_ids=author_ids,
        tag_ids=tag_ids,
        created_before=created_before,
        created_after=created_after,
        ftype=ftype,
        pending=pending,
    )
    return JSONResponse(
        {
            "total": total,
            "items": [await resource.to_dict(with_data=True) for resource in resources],
        }
    )


@router.post("")
@limiter.limit("5/5 seconds")
@ban_check
async def create_resource(
    request: AuthedRequest,
    payload_json: Annotated[bytes, Form(max_length=1024 * 1024)],  # 1 KiB is probably enough for JSON
    file: Annotated[UploadFile | None, File()] = None,
):
    data = ResourceCreateRequest.model_validate_json(payload_json.decode("utf-8"))

    if file and not file.filename:
        raise CustomValidationError("File must have a filename")

    if data.url and file:
        raise CustomValidationError("Resource must only have one of url or file")
    if not data.url and not file:
        raise CustomValidationError("Resource must have one of url or file")
    if file:
        uri = f"files/{data.course_id}/{urandom(16).hex()}/{file.filename}"
        await upload_object(request.app, uri, file.file.read())
    else:
        uri = data.url

    if not uri:
        raise CustomValidationError("Resource must have a url or file")

    if file:
        ftype = file.filename.split(".")[-1]  # type: ignore # checked above
    else:
        parsed = yarl.URL(uri)
        # We need to unwrap youtu.be URLs
        if parsed.host == "youtu.be":
            uri = f"https://www.youtube.com/watch?v={parsed.path[1:]}"
            ftype = "video"
        elif parsed.host == "www.youtube.com" or parsed.host == "youtube.com":
            ftype = "video"
        ftype = "other"

    resource = await request.app.state.resources.create(
        **{k: v for k, v in data.model_dump().items() if v is not None and k != "url"},
        uri=uri,  # type: ignore # uri will be set
        type=ResourceType.file if file else ResourceType.url,
        author_id=request.state.user.id,
        ftype=ftype,
        pending=not request.state.user.has_flag(UserFlags.trusted),
    )

    return JSONResponse(await resource.to_dict(with_data=True), status_code=201)


@router.get("/{id}")
@limiter.limit("10/5 seconds")
@auth_check
async def get_resource(request: AuthedRequest, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)
    if resource.pending and not request.state.user.has_flag(UserFlags.staff):
        raise CustomValidationError("Resource is pending approval", 403)
    return JSONResponse(await resource.to_dict(with_data=True))


@router.post("/{id}/download")
@limiter.limit("10/5 seconds")
@auth_check
async def download_resource(request: AuthedRequest, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)
    if resource.pending and not request.state.user.has_flag(UserFlags.staff):
        raise CustomValidationError("Resource is pending approval", 403)

    if resource.type == ResourceType.url:
        # Fallback I guess
        uri = resource.uri
    else:
        uri = await generate_presigned_url(request.app, resource.uri)

    response = {"url": uri}
    if resource.type == ResourceType.file:
        response["filename"] = resource.uri.split("/")[-1]
    return JSONResponse(response)


@router.patch("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def update_resource(request: AuthedRequest, id: str, data: ResourceUpdateRequest):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)

    if data.url and resource.type == ResourceType.file:
        raise CustomValidationError("Cannot update file uri")

    dumped = {k: v for k, v in data.model_dump().items() if v is not None}
    if "url" in dumped:
        dumped["uri"] = dumped.pop("url")

    resource = await request.app.state.resources.update(id=resource.id, **dumped)
    return JSONResponse(await resource.to_dict(with_data=True))


@router.post("/{id}/approve")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def approve_resource(request: AuthedRequest, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)

    resource = await request.app.state.resources.update(id=resource.id, pending=False)
    return JSONResponse(await resource.to_dict())


@router.post("/{id}/deny")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def deny_resource(request: AuthedRequest, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)

    # TODO: Do something better than just deleting the resource
    if resource.type == ResourceType.file:
        # Delete the file from S3
        await delete_object(request.app, resource.uri)
    await request.app.state.resources.delete(id)
    return JSONResponse(await resource.to_dict())


@router.delete("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def delete_resource(request: AuthedRequest, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        return Response(status_code=204)

    if resource.type == ResourceType.file:
        # Delete the file from S3
        await delete_object(request.app, resource.uri)
    await request.app.state.resources.delete(id)
    return Response(status_code=204)


def setup(api: APIRouter):
    api.include_router(router, tags=["resources"])
