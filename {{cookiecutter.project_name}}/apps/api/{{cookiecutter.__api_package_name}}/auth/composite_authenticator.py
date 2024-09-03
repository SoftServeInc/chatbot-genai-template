"""The module that contains composite authenticator implementation"""

from typing import ClassVar, Final, Optional

from ..models.user import User
from .abstract_authenticator import AbstractAuthenticator, Authenticated


class CompositeAuthenticator(AbstractAuthenticator):
    """Composite authenticator that uses multiple authenticators to authenticate users"""

    NAME: ClassVar[str] = "composite"
    ID_SEPARATOR: Final[str] = "."

    _authenticators: list[AbstractAuthenticator]

    def __init__(self, authenticators: list[AbstractAuthenticator]):
        self._authenticators = authenticators

    async def authenticate(self, username: str, password: str) -> Optional[Authenticated]:
        """Authenticate user by username and password and return a tuple of user data and JWT token"""
        for authenticator in self._authenticators:
            if authenticated := await authenticator.authenticate(username, password):
                authenticated.user.id = self._format_user_id(authenticator, authenticated.user.id)
                return authenticated

        return None

    async def verify_user(self, token: str) -> Optional[User]:
        """Verify JWT token and return the user if token is valid or None otherwise"""
        for authenticator in self._authenticators:
            if user := await authenticator.verify_user(token):
                user.id = self._format_user_id(authenticator, user.id)
                return user

        return None

    async def verify_user_id(self, token: str) -> Optional[str]:
        """Verify JWT token and return the user ID if token is valid or None otherwise"""
        for authenticator in self._authenticators:
            if user_id := await authenticator.verify_user_id(token):
                return self._format_user_id(authenticator, user_id)

        return None

    def _format_user_id(self, authenticator: AbstractAuthenticator, user_id: str) -> str:
        """Format user ID ensuring it is prefixed with the authenticator name"""
        prefix = f"{authenticator.NAME}{self.ID_SEPARATOR}"

        return user_id if user_id.startswith(prefix) else f"{prefix}{user_id}"
