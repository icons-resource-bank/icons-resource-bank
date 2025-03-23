from __future__ import annotations

from copy import copy
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Self

if TYPE_CHECKING:
    from ...app import Application

__all__ = (
    "Model",
    "BaseManager",
)


def _parse(value: Any) -> Any:
    if isinstance(value, datetime):
        return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z") if value else None
    return value


def _dict_factory(data: list[tuple[str, Any]]) -> dict[str, Any]:
    return {key: _parse(value) for (key, value) in data if not key.startswith("_")}


@dataclass(slots=True, kw_only=True)
class Model:
    _manager: BaseManager = field(repr=False)

    @classmethod
    def from_row(cls, manager: BaseManager, row: dict[str, Any]) -> Self:
        return cls(_manager=manager, **row)

    def to_dict(self) -> dict[str, Any]:
        # Dirty nasty filthy hack
        _inst = copy(self)
        _inst._manager = None  # type: ignore
        return asdict(_inst, dict_factory=_dict_factory)


class BaseManager:
    def __init__(self, app: Application):
        self.app = app

    async def get(self):
        raise NotImplementedError

    async def create(self):
        raise NotImplementedError

    async def update(self):
        raise NotImplementedError

    async def delete(self):
        raise NotImplementedError
