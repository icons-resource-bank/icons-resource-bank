from typing import Annotated

from pydantic import BaseModel, Field, field_serializer, FutureDatetime

from ..managers.user import UserFlags

__all__ = ("UserRequest",)


class UserRequest(BaseModel):
    name: Annotated[str | None, Field(max_length=255)] = None
    flags: int | None = None
    temp_banned_until: FutureDatetime | None = None

    @field_serializer("flags")
    def serialize_flags(self, v: int) -> int:
        # Ensure only valid flags are set
        return v & sum(UserFlags)
