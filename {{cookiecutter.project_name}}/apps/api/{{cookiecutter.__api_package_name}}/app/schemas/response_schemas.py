"""Error responses and exception handlers for the API"""

# pylint: disable=missing-class-docstring
from typing import Any, Literal, Optional, Sequence

from pydantic import BaseModel, Field, validator


class ValidationErrorDetail(BaseModel):
    """Input validation error detail model"""

    type: str
    location: str
    message: str

    @validator("location", pre=True)
    def _validate_location(cls, value: Any) -> str:  # pylint: disable=no-self-argument
        """Parse and validate the location value"""
        if not value:
            return ""

        if isinstance(value, str):
            return value

        if isinstance(value, Sequence):
            if len(value) == 1:
                return str(value[0])

            source = value[0]
            keys: list[str] = []

            for k in value[1:]:
                if k is None or k == "":
                    continue
                if isinstance(k, int) and keys:
                    last_index = len(keys) - 1
                    keys[last_index] = f"{keys[last_index]}[{k}]"
                else:
                    keys.append(str(k))

            return f"{source}:{'.'.join(keys)}"

        raise ValueError("location value has invalid format")


class ValidationError(BaseModel):
    """Input validation error (422 status) model"""

    status: Literal[422] = 422
    type: Literal["validation_error"] = "validation_error"
    title: Optional[str] = "Validation Error"
    details: list[ValidationErrorDetail] = []


class ValidationErrorResponse(BaseModel):
    """Input validation error response model"""

    error: ValidationError


class UnauthorizedError(BaseModel):
    """Unauthorized error (401 status) model"""

    status: Literal[401] = 401
    type: Literal["unauthorized"] = "unauthorized"
    title: Optional[str] = "Unauthorized"
    details: list[str] = []


class UnauthorizedErrorResponse(BaseModel):
    """Unauthorized error response model"""

    error: UnauthorizedError


class ForbiddenError(BaseModel):
    """Forbidden error (403 status) model"""

    status: Literal[403] = 403
    type: Literal["forbidden"] = "forbidden"
    title: Optional[str] = "Forbidden"
    details: list[str] = []


class ForbiddenErrorResponse(BaseModel):
    """Forbidden error response model"""

    error: ForbiddenError


class NotFoundError(BaseModel):
    """Not Found error (404 status) model"""

    status: Literal[404] = 404
    type: Literal["not_found"] = "not_found"
    title: Optional[str] = "Not Found"
    details: list[str] = []


class NotFoundErrorResponse(BaseModel):
    """Not Found error response model"""

    error: NotFoundError


class CommonHttpError(BaseModel):
    """Common HTTP error (>=400 status) model"""

    status: int = Field(..., ge=400, le=599)
    type: str
    title: str
    details: list[str] = []


class CommonHttpErrorResponse(BaseModel):
    """Common HTTP error response model"""

    error: CommonHttpError


_schemas = {
    204: {
        "description": "Successful operation",
        "content": {
            "text/plain": {
                "example": "(empty response body)",
            }
        },
    },
    401: {
        "description": "Unauthorized",
        "model": UnauthorizedErrorResponse,
    },
    403: {
        "description": "Forbidden",
        "model": ForbiddenErrorResponse,
    },
    404: {
        "description": "Not Found",
        "model": NotFoundErrorResponse,
    },
    422: {
        "description": "Validation Error",
        "model": ValidationErrorResponse,
    },
}


def responses(*args: int):
    """Return a dictionary of error responses for the specified status codes."""
    return {code: _schemas[code] for code in args if code in _schemas}
