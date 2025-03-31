from typing import Annotated

from pydantic import BaseModel, Field

__all__ = (
    "CourseCreateRequest",
    "CourseUpdateRequest",
    "TagCreateRequest",
    "TagUpdateRequest",
)


class CourseCreateRequest(BaseModel):
    code: Annotated[str, Field(min_length=4, max_length=16)]
    name: Annotated[str, Field(min_length=4, max_length=64)]
    year_level: Annotated[int, Field(ge=1, le=4)]
    category: Annotated[str, Field(min_length=1, max_length=64)]
    icon: Annotated[str, Field(min_length=4, max_length=64)]
    description: Annotated[str, Field(min_length=8, max_length=4096)]


class CourseUpdateRequest(BaseModel):
    code: Annotated[str | None, Field(min_length=4, max_length=16)] = None
    name: Annotated[str | None, Field(min_length=4, max_length=64)] = None
    year_level: Annotated[int | None, Field(ge=1, le=4)] = None
    category: Annotated[str | None, Field(min_length=1, max_length=64)] = None
    icon: Annotated[str | None, Field(min_length=4, max_length=64)] = None
    description: Annotated[str | None, Field(min_length=8, max_length=4096)] = None


class TagCreateRequest(BaseModel):
    name: Annotated[str, Field(min_length=4, max_length=64)]
    color: Annotated[int, Field(ge=0, le=0xFFFFFF)]


class TagUpdateRequest(BaseModel):
    name: Annotated[str | None, Field(min_length=4, max_length=32)] = None
    color: Annotated[int | None, Field(ge=0, le=0xFFFFFF)] = None
