from typing import Annotated, Any, Self

from pydantic_core import PydanticCustomError
from pydantic import BaseModel, Field, model_validator, ModelWrapValidatorHandler

__all__ = ("AuthCallbackRequest",)


class AuthCallbackRequest(BaseModel):
    code: Annotated[str | None, Field(max_length=5000)] = None
    error: Annotated[str | None, Field(max_length=100)] = None
    error_description: Annotated[str | None, Field(max_length=500)] = None
    redirect_uri: Annotated[str | None, Field(max_length=500)] = None

    @model_validator(mode="wrap")
    @classmethod
    def validate_code_or_error(cls, data: Any, handler: ModelWrapValidatorHandler[Self]) -> Self:
        model = handler(data)

        if not model.code and not model.error:
            raise PydanticCustomError("field_required", "At least one of code or error is required")
        if model.code and model.error:
            raise PydanticCustomError("field_conflict", "Only one of code or error is allowed")
        if model.error and not model.error_description:
            raise PydanticCustomError("field_required", "error_description is required")
        if not model.error and model.error_description:
            raise PydanticCustomError("field_conflict", "error is required")

        return model
