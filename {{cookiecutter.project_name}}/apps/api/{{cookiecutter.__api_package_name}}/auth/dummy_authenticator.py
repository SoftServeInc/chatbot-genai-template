"""The module that contains composite authenticator implementation"""

from typing import ClassVar, Final, Optional

from ..models.user import User
from .abstract_authenticator import AbstractAuthenticator, Authenticated


class DummyAuthenticator(AbstractAuthenticator):
    """Composite authenticator that uses multiple authenticators to authenticate users"""

    NAME: ClassVar[str] = "dummy"

    DUMMY_USER: Final[User] = User(
        id="12345",
        username="dummy",
        first_name="Dummy",
        last_name="Dummy",
        avatar_url=User.generate_avatar_url("DD"),
    )

    DUMMY_TOKEN: Final[str] = "dummy.dummy.dummy"

    async def authenticate(self, username: str, password: str) -> Optional[Authenticated]:
        return (
            Authenticated(self.DUMMY_USER, self.DUMMY_TOKEN)
            if username == self.DUMMY_USER.username and password == self.DUMMY_USER.username
            else None
        )

    async def verify_user(self, token: str) -> Optional[User]:
        """Verify JWT token and return the user if token is valid or None otherwise"""
        return self.DUMMY_USER if token == self.DUMMY_TOKEN else None

    async def verify_user_id(self, token: str) -> Optional[str]:
        """Verify JWT token and return the user ID if token is valid or None otherwise"""
        return self.DUMMY_USER.id if token == self.DUMMY_TOKEN else None
