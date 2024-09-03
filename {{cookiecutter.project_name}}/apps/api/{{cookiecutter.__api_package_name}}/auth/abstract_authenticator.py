"""The module that contains base abstract class for authenticators"""

from abc import ABC, abstractmethod
from typing import ClassVar, Optional

from pydantic import BaseModel, Field

from ..models.user import User


class Authenticated(BaseModel):
    """Result of authentication operation"""

    user: User = Field(description="User data")
    token: str = Field(description="JWT token")

    def __init__(self, user: User, token: str) -> None:
        super().__init__(user=user, token=token)


class AbstractAuthenticator(ABC):
    """Base abstract class for authenticators"""

    NAME: ClassVar[str]

    @abstractmethod
    async def authenticate(self, username: str, password: str) -> Optional[Authenticated]:
        """Authenticate user by username and password"""

    @abstractmethod
    async def verify_user(self, token: str) -> Optional[User]:
        """Verify auth token and return the user if token is valid or None otherwise"""

    @abstractmethod
    async def verify_user_id(self, token: str) -> Optional[str]:
        """Verify auth token and return the user ID if token is valid or None otherwise"""
