from __future__ import annotations

import datetime
import enum
from copy import copy
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, TypedDict, Unpack

from .base import *

if TYPE_CHECKING:
    from ...app import Application

__all__ = (
    "Resource",
    "ResourceType",
    "ResourceManager",
)


@dataclass(slots=True, kw_only=True)
class Resource(Model):
    _manager: ResourceManager
    id: str
    course_id: str
    type: ResourceType
    title: str
    description: str | None = None
    created_at: datetime.datetime
    author_id: str
    uri: str
    tag_ids: list[str]
    download_count: int = 0
    pending: bool
    ftype: str

    async def to_dict(self, *, with_data: bool = False) -> dict[str, Any]:
        data = Model.to_dict(self)
        if with_data:
            manager = self._manager
            data["course"] = (await manager.app.state.courses.get_course(id=data.pop("course_id"))).to_dict()  # type: ignore
            data["author"] = (
                await manager.app.state.users.get(id=data.pop("author_id")) or manager.app.state.users.DELETED
            ).to_dict()
            data["tags"] = [(await manager.app.state.courses.get_tag(id=tag_id)).to_dict() for tag_id in data["tag_ids"]]  # type: ignore
        return data


class ResourceType(enum.IntEnum):
    url = 1
    file = 2


class _QueryArguments(TypedDict, total=False):
    course_ids: list[str] | None
    author_ids: list[str] | None
    type: ResourceType | None
    tag_ids: list[str] | None
    created_before: datetime.datetime | None
    created_after: datetime.datetime | None
    query: str | None
    title: str | None
    description: str | None
    ftype: list[str] | None
    pending: bool | None


class _UpdateArguments(TypedDict, total=False):
    title: str
    uri: str
    description: str
    pending: bool
    tag_ids: list[str]


class ResourceManager(BaseManager):
    def __init__(self, app: Application):
        self.app = app

    # Hairy query
    _FILTERED_QUERY = """
        SELECT
            resources.*,
            COALESCE(array_agg(DISTINCT resource_tags.tag_id) FILTER (WHERE resource_tags.tag_id IS NOT NULL), '{{}}') AS tag_ids,
            COUNT(analytics.id) AS download_count,
            COUNT(*) OVER() AS total_count
        FROM resources
        LEFT JOIN resource_tags ON resources.id = resource_tags.resource_id
        LEFT JOIN analytics ON analytics.reference_id = resources.id AND analytics.event = 'download'
        WHERE {query}
        GROUP BY resources.id
        ORDER BY {sort}
        """

    async def get(self, id: str) -> Resource | None:
        result = await self.app.state.pool.fetchrow(
            self._FILTERED_QUERY.format(query="resources.id = $1", sort="resources.id"),
            id,
        )
        if not result:
            return

        return Resource.from_row(self, result)

    async def get_count(
        self, *, course_id: str | None = None, author_id: str | None = None, tag_id: str | None = None
    ) -> int:
        if not course_id and not author_id and not tag_id:
            raise TypeError("get_count() missing 1 required keyword-only argument")
        if len(list(filter(None, (course_id, author_id, tag_id)))) > 1:
            raise ValueError("Only one of course_id, author_id, or tag_id can be set")

        if tag_id is not None:
            result = await self.app.state.pool.fetchrow(
                "SELECT COUNT(*) FROM resource_tags WHERE tag_id = $1",
                tag_id,
            )
        else:
            result = await self.app.state.pool.fetchrow(
                f"SELECT COUNT(*) FROM resources WHERE {'course_id' if course_id else 'author_id'} = $1",
                course_id or author_id,
            )

        if not result:
            return 0
        return result["count"]

    async def query(
        self,
        *,
        limit: int = 100,
        offset: int = 0,
        sort_by: str = "resources.created_at DESC",
        **kwargs: Unpack[_QueryArguments],
    ) -> tuple[list[Resource], int]:
        where, params = [], []
        index = 1

        if kwargs.get("query") and (kwargs.get("title") or kwargs.get("description")):
            raise ValueError("Cannot use query and title/description at the same time")

        for key, value in kwargs.items():
            if value is None:
                continue

            if key in ("course_ids", "author_ids"):
                where.append(f"resources.{key[:-1]} = ANY(${index})")
                params.append(value)  # type: ignore
            elif key == "ftype":
                where.append(f"resources.ftype = ANY(${index})")
                params.append(value)  # type: ignore
            elif key == "tag_ids":
                for tag_id in value:  # type: ignore
                    where.append(f"resource_tags.tag_id = ${index}")
                    params.append(tag_id)
                    index += 1
                continue
            elif key == "created_before":
                where.append(f"resources.created_at < ${index}")
                params.append(value)
            elif key == "created_after":
                where.append(f"resources.created_at > ${index}")
                params.append(value)

            # We use pg_trgm for fuzzy search
            elif key == "query":
                where.append(f"(resources.title % ${index} OR resources.description % ${index})")
                params.append(value)
            elif key in ("title", "description"):
                where.append(f"resources.{key} % ${index}")
                params.append(value)

            else:
                where.append(f"resources.{key} = ${index}")
                params.append(value)
            index += 1
        if not where:
            where.append("true")

        if any(kwargs.get(key) for key in ("query", "title", "description")) and sort_by.startswith("resources.query "):
            greatest = []
            for key in ("title", "description"):
                if kwargs.get(key) or kwargs.get("query"):
                    greatest.append(f"similarity(resources.{key}, ${index})")
                    params.append(kwargs[key] if kwargs.get(key) else kwargs["query"])  # type: ignore
                    index += 1
            sort_by = f"greatest({', '.join(greatest)}) {sort_by.split()[-1]}"
        elif sort_by.startswith("resources.query "):
            sort_by = sort_by.replace("resources.query", "resources.created_at")

        query = self._FILTERED_QUERY.format(query=" AND ".join(where), sort=sort_by) + f" LIMIT {limit} OFFSET {offset}"
        try:
            result = await self.app.state.pool.fetch(query, *params)
        except Exception as e:
            print(query, params)
            print(e)
            __import__("traceback").print_exc()
            raise e
        return [Resource.from_row(self, row) for row in result], result[0]["total_count"] if result else 0

    async def create(
        self,
        *,
        course_id: str,
        author_id: str,
        type: ResourceType,
        title: str,
        uri: str,
        description: str | None = None,
        tag_ids: list[str] | None = None,
        pending: bool = True,
        ftype: str,
    ) -> Resource:
        result = await self.app.state.pool.fetchrow(
            "INSERT INTO resources (course_id, author_id, type, title, uri, description, pending, ftype) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            course_id,
            author_id,
            type,
            title,
            uri,
            description,
            pending,
            ftype,
        )
        result = dict(result, tag_ids=tag_ids or [])
        resource = Resource.from_row(self, result)

        if tag_ids:
            await self.app.state.pool.executemany(
                "INSERT INTO resource_tags (resource_id, tag_id) VALUES ($1, $2)",
                [(resource.id, tag_id) for tag_id in tag_ids],
            )

        return resource

    async def update(self, id: str, **kwargs: Unpack[_UpdateArguments]) -> Resource:
        resource = await self.get(id)
        if not resource:
            raise ValueError("Resource not found")

        if "tag_ids" in kwargs:
            await self.app.state.pool.execute("DELETE FROM resource_tags WHERE resource_id = $1", resource.id)
            tag_ids = kwargs.pop("tag_ids")
            if tag_ids:
                await self.app.state.pool.executemany(
                    "INSERT INTO resource_tags (resource_id, tag_id) VALUES ($1, $2)",
                    [(resource.id, tag_id) for tag_id in tag_ids],
                )
            resource.tag_ids = tag_ids

        if not kwargs:
            return resource

        _inst = copy(resource)
        for key, value in kwargs.items():
            setattr(_inst, key, value)
        await self._update(_inst)
        return _inst

    async def _update(self, resource: Resource) -> None:
        await self.app.state.pool.execute(
            "UPDATE resources SET title = $1, uri = $2, description = $3, pending = $4 WHERE id = $5",
            resource.title,
            resource.uri,
            resource.description,
            resource.pending,
            resource.id,
        )

    async def delete(self, id: str) -> None:
        await self.app.state.pool.execute("DELETE FROM resources WHERE id = $1", id)
