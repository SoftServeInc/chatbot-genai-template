"""Custom exceptions by API route handlers"""

from typing import Optional

from fastapi.exceptions import HTTPException


class BadRequestException(HTTPException):
    """Exception for 400 Bad Request"""

    def __init__(self, detail: str = "Bad Request", headers: Optional[dict[str, str]] = None):
        super().__init__(status_code=400, detail=detail, headers=headers)


class UnauthorizedException(HTTPException):
    """Exception for 401 Unauthorized"""

    def __init__(self, detail: str = "Unauthorized", headers: Optional[dict[str, str]] = None):
        super().__init__(status_code=401, detail=detail, headers=headers or {"WWW-Authenticate": "Bearer"})


class ForbiddenException(HTTPException):
    """Exception for 403 Forbidden"""

    def __init__(self, detail: str = "Forbidden", headers: Optional[dict[str, str]] = None):
        super().__init__(status_code=403, detail=detail, headers=headers)


class NotFoundException(HTTPException):
    """Exception for 404 Not Found"""

    def __init__(self, detail: str = "Not Found", headers: Optional[dict[str, str]] = None):
        super().__init__(status_code=404, detail=detail, headers=headers)


class NotImplementedException(HTTPException):
    """Exception for 501 Not Implemented"""

    def __init__(self, detail: str = "Not Implemented", headers: Optional[dict[str, str]] = None):
        super().__init__(status_code=501, detail=detail, headers=headers)
