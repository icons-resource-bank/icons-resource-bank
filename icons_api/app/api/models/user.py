from typing import Annotated, Literal

from pydantic import BaseModel, Field, FutureDatetime, field_serializer

from ..managers.user import UserFlags

__all__ = ("UserRequest", "ConsentRequest", "BanRequest", "AnalyticsRequest", "FeedbackRequest")


class UserRequest(BaseModel):
    name: Annotated[str | None, Field(max_length=255)] = None
    flags: int | None = None
    temp_banned_until: FutureDatetime | None = None

    @field_serializer("flags")
    def serialize_flags(self, v: int) -> int:
        # Ensure only valid flags are set
        return v & sum(UserFlags)


class ConsentRequest(BaseModel):
    analytics: bool


class BanRequest(BaseModel):
    until: FutureDatetime | None = None


class AnalyticsRequest(BaseModel):
    event: Annotated[Literal["download"], Field(max_length=255)]
    reference_id: Annotated[str, Field(max_length=255)]


class FeedbackRequest(BaseModel):
    comment: Annotated[str, Field(min_length=10, max_length=1000)]
