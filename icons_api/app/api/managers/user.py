from __future__ import annotations

import datetime
import enum
from copy import copy
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, overload

from .base import *
from ...utils.dequedict import DequeDict

if TYPE_CHECKING:
    from ...app import Application

__all__ = (
    "User",
    "UserFlags",
    "UserManager",
)


@dataclass(slots=True, kw_only=True)
class User(Model):
    _manager: UserManager  # type: ignore
    id: str
    email: str
    name: str
    flags: int
    created_at: datetime.datetime
    temp_banned_until: datetime.datetime | None = None

    @classmethod
    def _deleted(cls) -> User:
        return cls(
            _manager=None,  # type: ignore
            id="0",
            email="deleted@queensu.ca",
            name="Deleted User",
            flags=0,
            created_at=datetime.datetime.fromtimestamp(0, datetime.timezone.utc),
            temp_banned_until=None,
        )

    def has_flag(self, flag: UserFlags) -> bool:
        return bool(self.flags & flag)

    async def set_flag(self, flag: UserFlags) -> None:
        _inst = copy(self)
        _inst.flags |= flag
        await self._manager._update(_inst)

    def is_banned(self) -> bool:
        return (
            self.has_flag(UserFlags.banned)
            or self.temp_banned_until is not None
            and self.temp_banned_until > datetime.datetime.now(datetime.timezone.utc)
        )


class UserFlags(enum.IntFlag):
    admin = 1
    staff = 2
    trusted = 4
    banned = 8


class UserManager(BaseManager):
    def __init__(self, app: Application):
        self.app = app
        self.cache: DequeDict[str, User] = DequeDict(maxlen=1024)
        self._email_map: DequeDict[str, str] = DequeDict(maxlen=1024)
        self.DELETED = User._deleted()

    async def _fetch(self, *, id: str | None = None, email: str | None = None) -> User | None:
        if id and email:
            raise ValueError("Cannot specify both id and email")
        if not id and not email:
            raise ValueError("Must specify either id or email")

        result = await self.app.state.pool.fetchrow(
            f"SELECT * FROM users WHERE {'id' if id else 'email'} = $1",
            id or email,
        )
        if not result:
            return

        user = User.from_row(self, result)
        self.cache[user.id] = user
        self._email_map[user.email] = user.id
        return user

    async def get(self, *, id: str | None = None, email: str | None = None) -> User | None:
        if id and email:
            raise ValueError("Cannot specify both id and email")
        if not id and not email:
            raise ValueError("Must specify either id or email")

        if id is not None:
            if user := self.cache.get(id):
                return user
        elif email is not None:
            if id := self._email_map.get(email):
                return await self.get(id=id)
        return await self._fetch(id=id, email=email)

    @overload
    async def create(self, *, email: str, name: str, flags: int = 0, ignore_conflict: bool = False) -> User: ...

    @overload
    async def create(self, *, ignore_conflict: bool = False, **kwargs: Any) -> User: ...

    async def create(self, *, ignore_conflict: bool = False, **kwargs) -> User:
        query = f"INSERT INTO users ({', '.join(kwargs)}) VALUES ({', '.join(f'${i + 1}' for i in range(len(kwargs)))})"
        if ignore_conflict:
            query += f" ON CONFLICT (email) DO UPDATE SET {', '.join(f'{key} = EXCLUDED.{key}' for key in kwargs if key != 'email')}"
        query += " RETURNING *"

        result = await self.app.state.pool.fetchrow(query, *kwargs.values())
        user = User.from_row(self, result)
        self.cache[user.id] = user
        self._email_map[user.email] = user.id
        return user

    async def update(self, *, id: str | None = None, **kwargs: Any) -> User:
        user = await self.get(id=id, email=kwargs.pop("email", None) if not id else None)
        if not user:
            raise ValueError("User not found")

        _inst = copy(user)
        for key, value in kwargs.items():
            setattr(_inst, key, value)
        await self._update(_inst)
        return _inst

    async def _update(self, user: User) -> None:
        await self.app.state.pool.execute(
            "UPDATE users SET email = $1, name = $2, flags = $3 WHERE id = $4",
            user.email,
            user.name,
            user.flags,
            user.id,
        )
        self.cache[user.id] = user
        self._email_map[user.email] = user.id
