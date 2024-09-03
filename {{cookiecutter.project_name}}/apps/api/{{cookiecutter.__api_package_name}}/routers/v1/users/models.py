"""DTO models for the User API endpoints"""

from typing import Any, Optional

from pydantic import BaseModel

from ....models import TermsVersionBase, User


class LogIn(BaseModel):
    """DTO request model for POST /users/login endpoint"""

    username: str
    password: str


class AgreedTermsVersion(TermsVersionBase):
    """DTO model for the terms of service that a user has agreed to"""

    agreed: bool


class LoggedIn(BaseModel):
    """DTO response model for POST /users/login endpoint"""

    user: User
    token: str
    terms: Optional[AgreedTermsVersion] = None

    def dict(self, *args, **kwargs) -> dict[str, Any]:
        """Override the default dict method to exclude None values in the response"""
        kwargs.pop("exclude_none", None)
        return super().dict(*args, exclude_none=True, **kwargs)
