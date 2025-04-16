from __future__ import annotations

import datetime
import enum
from copy import copy
from dataclasses import dataclass
from typing import TYPE_CHECKING, Any, overload, Self, Unpack, TypedDict, Final

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
        if flag == UserFlags.staff and self.has_flag(UserFlags.admin):
            return True
        return bool(self.flags & flag)

    async def set_flag(self, flag: UserFlags, value: bool = True) -> Self:
        if self.has_flag(flag) == value:
            return self

        _inst = copy(self)
        if value:
            _inst.flags |= flag
        else:
            _inst.flags &= ~flag
        await self._manager._update(_inst)
        return _inst

    def is_banned(self) -> bool:
        return (
            self.has_flag(UserFlags.banned)
            or self.temp_banned_until is not None
            and self.temp_banned_until > datetime.datetime.now(datetime.timezone.utc)
        )

    def can_track(self) -> bool:
        return not self.has_flag(UserFlags.analytics_opt_out) and not self.is_banned()


@dataclass(slots=True, kw_only=True)
class UserSettings(Model):
    _manager: UserManager
    id: str
    theme: str


class UserFlags(enum.IntFlag):
    admin = 1
    staff = 2
    trusted = 4
    banned = 8
    analytics_opt_out = 16  # Opt-out system here


class _QueryArguments(TypedDict):
    flags: UserFlags | None
    query: str | None
    name: str | None
    email: str | None


class UserManager(BaseManager):
    DELETED: Final[User] = User._deleted()

    def __init__(self, app: Application):
        self.app = app
        self.cache: DequeDict[str, User] = DequeDict(maxlen=1024)
        self._email_map: DequeDict[str, str] = DequeDict(maxlen=1024)

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

    async def query(
        self, *, limit: int = 100, offset: int = 0, sort_by: str = "created_at DESC", **kwargs: Unpack[_QueryArguments]
    ) -> tuple[list[User], int]:
        where, params = [], []
        index = 1

        if kwargs.get("query") and (kwargs.get("name") or kwargs.get("email")):
            raise ValueError("Cannot use query and name/email at the same time")

        for key, value in kwargs.items():
            if value is None:
                continue
            if key == "flags":
                for flag in value:
                    if flag == UserFlags.banned:
                        where.append(f"has_flag(flags, ${index}) OR temp_banned_until > NOW()")
                    else:
                        where.append(f"has_flag(flags, ${index})")
                    params.append(flag.value)
                    index += 1
                continue

            # We use pg_trgm for fuzzy search
            elif key == "query":
                where.append(f"(name % ${index} OR email % ${index})")
                params.append(value)
            elif key in ("name", "email"):
                where.append(f"{key} % ${index}")
                params.append(value)
            else:
                where.append(f"{key} = ${index}")
                params.append(value)
            index += 1
        if not where:
            where.append("TRUE")

        if any(kwargs.get(key) for key in ("query", "name", "email")) and sort_by.startswith("query "):
            greatest = []
            for key in ("name", "email"):
                if kwargs.get(key) in kwargs or kwargs.get("query"):
                    greatest.append(f"similarity({key}, ${index})")
                    params.append(kwargs[key])
                    index += 1
            sort_by = f"greatest({', '.join(greatest)}) {sort_by.split()[-1]}"
        elif sort_by.startswith("query "):
            sort_by = sort_by.replace("query", "created_at")

        where = " AND ".join(where)
        print(f"SELECT *, COUNT(*) OVER() AS total FROM users WHERE {where} ORDER BY {sort_by} LIMIT $1 OFFSET $2")
        result = await self.app.state.pool.fetch(
            f"SELECT *, COUNT(*) OVER() AS total FROM users WHERE {where} ORDER BY {sort_by} LIMIT {limit} OFFSET {offset}",
            *params,
        )
        users = [User.from_row(self, row) for row in result]
        total = result[0]["total"] if result else 0
        return users, total

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

    async def get_settings(self, id: str) -> UserSettings | None:
        result = await self.app.state.pool.fetchrow("SELECT * FROM user_settings WHERE id = $1", id)
        if not result:
            return

        settings = UserSettings.from_row(self, result)
        return settings

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
        # We need to insert into user settings too
        await self.app.state.pool.execute(
            "INSERT INTO user_settings (id) VALUES ($1) ON CONFLICT DO NOTHING",
            result["id"],
        )

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

    async def update_settings(self, settings: UserSettings, **kwargs: Any) -> UserSettings:
        _inst = copy(settings)
        for key, value in kwargs.items():
            setattr(_inst, key, value)
        await self._update_settings(_inst)
        return _inst

    async def _update(self, user: User) -> None:
        await self.app.state.pool.execute(
            "UPDATE users SET email = $1, name = $2, flags = $3, temp_banned_until = $4 WHERE id = $5",
            user.email,
            user.name,
            user.flags,
            user.temp_banned_until,
            user.id,
        )
        self.cache[user.id] = user
        self._email_map[user.email] = user.id

    async def _update_settings(self, settings: UserSettings):
        return await self.app.state.pool.execute(
            "UPDATE user_settings SET theme = $1 WHERE id = $2",
            settings.theme,
            settings.id,
        )

    async def track(self, user: User, event: str, reference_id: str | None = None, **kwargs: Any) -> None:
        await self.app.state.pool.execute(
            "INSERT INTO analytics (event, user_id, reference_id, metadata) VALUES ($1, $2, $3, $4)",
            event,
            user.id,
            reference_id,
            kwargs,
        )
