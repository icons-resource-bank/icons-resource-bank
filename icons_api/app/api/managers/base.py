from __future__ import annotations

import inspect
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
    return {
        key: _parse(value)
        for (key, value) in data
        if not key.startswith("_") and not ((key.endswith("_id") or key.endswith("_ids")) and key is None)
    }


@dataclass(slots=True, kw_only=True)
class Model:
    _manager: BaseManager = field(repr=False)

    @classmethod
    def from_row(cls, manager: BaseManager, row: dict[str, Any]) -> Self:
        return cls(_manager=manager, **{k: v for k, v in row.items() if k in inspect.signature(cls).parameters})

    def to_dict(self) -> dict[str, Any]:
        # Dirty nasty filthy hack
        _inst = copy(self)
        _inst._manager = None  # type: ignore
        return asdict(_inst, dict_factory=_dict_factory)


class BaseManager:
    def __init__(self, app: Application):
        self.app = app

    @classmethod
    async def initialize(cls, app: Application) -> Self:
        inst = cls(app)
        await inst.startup()
        return inst

    async def startup(self):
        return
