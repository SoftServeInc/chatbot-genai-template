"""Error responses and exception handlers for the API"""

from typing import Any, Callable, Coroutine

from fastapi import Request, Response
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError as RequestValidationException
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from ..schemas.response_schemas import (
    CommonHttpError,
    CommonHttpErrorResponse,
    ValidationError,
    ValidationErrorDetail,
    ValidationErrorResponse,
)

details_by_status = {
    400: {"type": "bad_request", "title": "Bad Request"},
    401: {"type": "unauthorized", "title": "Unauthorized"},
    403: {"type": "forbidden", "title": "Forbidden"},
    404: {"type": "not_found", "title": "Not Found"},
    405: {"type": "method_not_allowed", "title": "Method Not Allowed"},
    408: {"type": "request_timeout", "title": "Request Timeout"},
    409: {"type": "conflict", "title": "Conflict"},
    422: {"type": "validation_error", "title": "Validation Error"},
    429: {"type": "too_many_requests", "title": "Too Many Requests"},
    500: {"type": "internal_server_error", "title": "Internal Server Error"},
    501: {"type": "not_implemented", "title": "Not Implemented"},
    503: {"type": "service_unavailable", "title": "Service Unavailable"},
}


async def validation_exception_handler(_: Request, exc: RequestValidationException):
    """Handle validation errors and return a JSON response with the details."""
    response = ValidationErrorResponse(
        error=ValidationError(
            details=[
                ValidationErrorDetail(
                    location=err["loc"],
                    message=err["msg"],
                    type=err["type"],
                )
                for err in exc.errors()
            ]
        )
    )

    return JSONResponse(
        content=jsonable_encoder(response),
        status_code=422,
    )


async def http_exception_handler(_: Request, exc: HTTPException):
    """Handle HTTP exceptions and return a JSON response with the details."""
    status = exc.status_code
    detail = details_by_status.get(exc.status_code, None)

    response = CommonHttpErrorResponse(
        error=CommonHttpError(
            status=status,
            type=detail["type"] if detail else "unknown_error",
            title=detail["title"] if detail else "Unknown Error",
            details=[exc.detail],
        )
    )

    return JSONResponse(
        content=jsonable_encoder(response),
        status_code=status,
    )


def exception_handlers() -> dict[int | type[Exception], Callable[[Request, Any], Coroutine[Any, Any, Response]]]:
    """Return a dictionary of exception handlers."""
    return {
        RequestValidationException: validation_exception_handler,
        HTTPException: http_exception_handler,
    }
