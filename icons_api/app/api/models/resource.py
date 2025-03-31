from typing import Annotated

from pydantic import BaseModel, Field

__all__ = (
    "MAX_FILE_LENGTH_MIB",
    "ResourceCreateRequest",
    "ResourceUpdateRequest",
)

MAX_FILE_LENGTH_MIB = 25


class ResourceCreateRequest(BaseModel):
    course_id: Annotated[str, Field(min_length=36, max_length=36)]
    title: Annotated[str, Field(min_length=4, max_length=64)]
    description: Annotated[str, Field(min_length=8, max_length=4096)]
    url: Annotated[str | None, Field(min_length=10, max_length=2048)] = None
    tag_ids: Annotated[list[str], Field(max_length=10, default_factory=list)]


class ResourceUpdateRequest(BaseModel):
    title: Annotated[str | None, Field(min_length=4, max_length=64)] = None
    description: Annotated[str | None, Field(min_length=8, max_length=4096)] = None
    url: Annotated[str | None, Field(min_length=10, max_length=2048)] = None
    tag_ids: Annotated[list[str], Field(max_length=10, default_factory=list)] = []
