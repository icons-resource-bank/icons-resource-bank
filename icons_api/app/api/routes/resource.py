from fastapi import APIRouter, Response, UploadFile, File, Form
from fastapi.responses import JSONResponse
from os import urandom

from typing import Annotated

from ...core.errors import CustomValidationError
from ...core.middleware import limiter
from ...core.s3 import *
from ...utils.decorators import *
from ..models.resource import *
from ..managers.resource import ResourceType
from ...request import Request

__all__ = ("setup",)

router = APIRouter(prefix="/resources")


# @router.get("")
# @limiter.limit("10/5 seconds")
# @auth_check
# async def get_resources(request: Request):
#     return [course.to_dict() for course in await request.app.state.courses.get_courses()]


@router.post("")
@limiter.limit("5/5 seconds")
@ban_check
async def create_resource(
    request: Request,
    payload_json: Annotated[bytes, Form(max_length=1024 * 1024)],  # 1 KiB is probably enough for JSON
    file: Annotated[UploadFile | None, File()] = None,
):
    data = ResourceCreateRequest.model_validate_json(payload_json.decode("utf-8"))

    if data.url and file:
        raise CustomValidationError("Resource must only have one of url or file")
    if not data.url and not file:
        raise CustomValidationError("Resource must have one of url or file")
    if file:
        uri = f"files/{data.course_id}/{urandom(16).hex()}/{file.filename}"
        await upload_object(request.app, uri, file.file.read())
    else:
        uri = data.url

    resource = await request.app.state.resources.create(
        **{k: v for k, v in data.model_dump().items() if v is not None and k != "url"},
        uri=uri,  # type: ignore # uri will be set
        type=ResourceType.file if file else ResourceType.url,
        author_id=request.state.user.id,  # type: ignore # author_id will be set
    )

    return JSONResponse(await resource.to_dict(with_data=True))


@router.get("/{id}")
@limiter.limit("10/5 seconds")
@auth_check
async def get_resource(request: Request, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)
    return JSONResponse(await resource.to_dict(with_data=True))


@router.post("/{id}/download")
@limiter.limit("10/5 seconds")
@auth_check
async def download_resource(request: Request, id: str):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)

    if resource.type == ResourceType.url:
        uri = resource.uri
    else:
        uri = await generate_presigned_url(request.app, resource.uri)

    response = {"uri": uri}
    if resource.type == ResourceType.file:
        response["filename"] = resource.uri.split("/")[-1]
    return JSONResponse(response)


@router.patch("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def update_resource(request: Request, id: str, data: ResourceUpdateRequest):
    resource = await request.app.state.resources.get(id=id)
    if not resource:
        raise CustomValidationError("Resource not found", 404)

    resource = await request.app.state.resources.update(
        id=resource.id, **{k: v for k, v in data.model_dump().items() if v is not None}
    )
    return JSONResponse(await resource.to_dict(with_data=True))


@router.delete("/{id}")
@limiter.limit("5/5 seconds")
@flag_check(staff=True)
async def delete_resource(request: Request, id: str):
    await request.app.state.resources.delete(id)
    return Response(status_code=204)


def setup(api: APIRouter):
    api.include_router(router, tags=["resources"])
