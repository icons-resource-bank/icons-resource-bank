from __future__ import annotations

import datetime
from copy import copy
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, Literal, Unpack, TypedDict

from .base import *

if TYPE_CHECKING:
    from ...app import Application

__all__ = (
    "Course",
    "Tag",
    "CourseManager",
)


@dataclass(slots=True, kw_only=True)
class Course(Model):
    _manager: CourseManager
    id: str
    code: str
    name: str
    year_level: Literal[1, 2, 3, 4]
    category: str
    icon: str
    description: str
    created_at: datetime.datetime


@dataclass(slots=True, kw_only=True)
class Tag(Model):
    _manager: CourseManager
    id: str
    name: str
    color: int
    created_at: datetime.datetime


class _CourseQueryArguments(TypedDict):
    query: str | None
    code: str | None
    name: str | None
    year_level: int | None
    category: str | None
    icon: str | None
    description: str | None


class CourseManager(BaseManager):
    def __init__(self, app: Application):
        self.app = app
        self.courses: dict[str, Course] = {}
        self.tags: dict[str, Tag] = {}

    async def startup(self) -> None:
        await self._fetchall()

    async def _fetchall(self) -> None:
        results = await self.app.state.pool.fetch("SELECT * FROM courses")
        self.courses = {result["id"]: Course.from_row(self, result) for result in results}

        results = await self.app.state.pool.fetch("SELECT * FROM tags")
        self.tags = {result["id"]: Tag.from_row(self, result) for result in results}

    async def _fetch_course(self, id: str) -> Course | None:
        result = await self.app.state.pool.fetchrow("SELECT * FROM courses WHERE id = $1", id)
        if not result:
            return

        course = Course.from_row(self, result)
        self.courses[course.id] = course
        return course

    async def _fetch_tag(self, id: str) -> Tag | None:
        result = await self.app.state.pool.fetchrow("SELECT * FROM tags WHERE id = $1", id)
        if not result:
            return

        tag = Tag.from_row(self, result)
        self.tags[tag.id] = tag
        return tag

    async def get_courses(self) -> list[Course]:
        return list(self.courses.values())

    async def query_courses(
        self, *, limit: int = 100, offset: int = 0, sort_by: str = "code ASC", **kwargs: Unpack[_CourseQueryArguments]
    ) -> tuple[list[Course], int]:
        where, params = [], []
        index = 1

        if kwargs.get("query") and (kwargs.get("code") or kwargs.get("name") or kwargs.get("category") or kwargs.get("description")):
            raise ValueError("Cannot use query and code/name/category/description at the same time")

        for key, value in kwargs.items():
            if value is None:
                continue

            # We use pg_trgm for fuzzy search
            elif key == "query":
                where.append(f"(code % ${index} OR name % ${index} OR category % ${index} OR description % ${index})")
                params.append(value)
            elif key in ("code", "name", "category", "description"):
                where.append(f"{key} % ${index}")
                params.append(value)
            else:
                where.append(f"{key} = ${index}")
                params.append(value)
            index += 1
        if not where:
            # if limit == 0:
            #     limit = len(self.courses)
            # return list(self.courses.values())[offset : limit + offset], len(self.courses)
            where.append("TRUE")

        if any(kwargs.get(key) for key in ("query", "code", "name", "category", "description")) and sort_by.startswith("query "):
            greatest = []
            for key in ("code", "name", "category", "description"):
                if kwargs.get(key) or kwargs.get("query"):
                    greatest.append(f"similarity({key}, ${index})")
                    params.append(kwargs[key])
                    index += 1
            sort_by = f"greatest({', '.join(greatest)}) {sort_by.split()[-1]}"
        elif sort_by.startswith("query "):
            sort_by = "code ASC"  # HACK HACK HACK

        where = " AND ".join(where)
        result = await self.app.state.pool.fetch(
            f"SELECT *, COUNT(*) OVER() AS total FROM courses WHERE {where} ORDER BY {sort_by} LIMIT {limit or len(self.courses)} OFFSET {offset}",
            *params,
        )
        return [Course.from_row(self, row) for row in result], result[0]["total"] if result else 0

    async def get_tags(self) -> list[Tag]:
        return list(self.tags.values())

    async def get_course(self, id: str) -> Course | None:
        # No cache lookup needed
        return self.courses.get(id)

    async def get_tag(self, id: str) -> Tag | None:
        # No cache lookup needed
        return self.tags.get(id)

    async def create_course(self, *, code: str, name: str, year_level: Literal[1, 2, 3, 4], category: str, icon: str, description: str | None = None) -> Course:
        result = await self.app.state.pool.fetchrow(
            "INSERT INTO courses (code, name, year_level, category, icon, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            code,
            name,
            year_level,
            category,
            icon,
            description,
        )
        course = Course.from_row(self, result)
        self.courses[course.id] = course
        return course

    async def create_tag(self, *, name: str, color: int) -> Tag:
        result = await self.app.state.pool.fetchrow(
            "INSERT INTO tags (name, color) VALUES ($1, $2) RETURNING *",
            name,
            color,
        )
        tag = Tag.from_row(self, result)
        self.tags[tag.id] = tag
        return tag

    async def update_course(self, *, id: str, **kwargs: Any) -> Course:
        course = await self.get_course(id)
        if not course:
            raise ValueError("Course not found")

        _inst = copy(course)
        for key, value in kwargs.items():
            setattr(_inst, key, value)
        await self._update_course(_inst)
        return _inst

    async def update_tag(self, *, id: str, **kwargs: Any) -> Tag:
        tag = await self.get_tag(id)
        if not tag:
            raise ValueError("Tag not found")

        _inst = copy(tag)
        for key, value in kwargs.items():
            setattr(_inst, key, value)
        await self._update_tag(_inst)
        return _inst

    async def _update_course(self, course: Course) -> None:
        await self.app.state.pool.execute(
            "UPDATE courses SET code = $1, name = $2, year_level = $3, icon = $4, description = $5, category = $6 WHERE id = $7",
            course.code,
            course.name,
            course.year_level,
            course.icon,
            course.description,
            course.category,
            course.id,
        )
        self.courses[course.id] = course

    async def _update_tag(self, tag: Tag) -> None:
        await self.app.state.pool.execute(
            "UPDATE tags SET name = $1, color = $2 WHERE id = $3",
            tag.name,
            tag.color,
            tag.id,
        )
        self.tags[tag.id] = tag

    async def delete_course(self, id: str) -> None:
        await self.app.state.pool.execute("DELETE FROM courses WHERE id = $1", id)
        self.courses.pop(id, None)

    async def delete_tag(self, id: str) -> None:
        await self.app.state.pool.execute("DELETE FROM tags WHERE id = $1", id)
        self.tags.pop(id, None)
