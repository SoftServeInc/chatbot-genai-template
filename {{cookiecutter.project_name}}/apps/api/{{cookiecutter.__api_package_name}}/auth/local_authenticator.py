"""The module that contains local authenticator implementation"""

from os import path
from typing import Any, ClassVar, Optional

import jwt
import yaml
from argon2 import PasswordHasher

from ..app.settings import settings
from ..common.datetime import seconds_from_now
from ..models.user import User
from .abstract_authenticator import AbstractAuthenticator, Authenticated


class LocalAuthenticator(AbstractAuthenticator):
    """Local authenticator that uses local yaml file to authenticate users"""

    NAME: ClassVar[str] = "local"

    _users: Optional[list[dict[str, str]]]
    _password_hasher: PasswordHasher

    def __init__(self) -> None:
        self._password_hasher = PasswordHasher()
        self._users = None

    async def get_users(self):
        """Get all user records from the local yaml file"""
        if self._users is None:
            users_path = settings.Auth.Local.users_path

            if not users_path or not path.exists(users_path):
                raise ValueError("Path to local users file is not specified or file does not exist")

            with open(users_path, "r", encoding="UTF-8") as file:
                users = yaml.safe_load(file)

            if not isinstance(users, list):
                raise ValueError("users_db.yaml should contain a list of users records")

            self._users = users

        return self._users

    async def authenticate(self, username: str, password: str) -> Optional[Authenticated]:
        """Authenticate user by username and password and return a tuple of user data and JWT token"""
        users = await self.get_users()

        for user in users:
            if user["username"] != username:
                continue

            if "password_hash" in user:
                if not self._verify_password_hash(str(user["password_hash"]), password):
                    return None
            elif "password" in user:
                if user["password"] != password:
                    return None
            else:
                return None

            user = self._build_user_model(user)
            token = self.generate_token(user)

            return Authenticated(user, token)

        return None

    def generate_token(self, user: User) -> str:
        """Generate JWT token for the user"""
        token = jwt.encode(
            {
                "sub": user.id,
                "preferred_username": user.username,
                "exp": seconds_from_now(settings.Auth.Local.jwt_ttl),
            },
            settings.Auth.Local.jwt_secret,
            algorithm="HS256",
        )
        return str(token)

    async def verify_user(self, token: str) -> Optional[User]:
        """Verify JWT token and return the user if token is valid or None otherwise"""
        user_id = await self.verify_user_id(token)

        return (await self.get_user(user_id)) if user_id else None

    async def verify_user_id(self, token: str) -> Optional[str]:
        """Verify JWT token and return the user ID if token is valid or None otherwise"""
        try:
            payload = jwt.decode(token, settings.Auth.Local.jwt_secret, algorithms=["HS256"])
            return str(payload.get("sub", ""))
        except jwt.exceptions.InvalidTokenError:
            return None

    async def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        users = await self.get_users()

        for user in users:
            if user["id"] == user_id:
                return self._build_user_model(user)

        return None

    def _verify_password_hash(self, password_hash: str, password: str) -> bool:
        try:
            return self._password_hasher.verify(password_hash, password)
        except Exception:
            return False

    def _build_user_model(self, user: dict[str, Any]) -> User:
        """Build a user model from the dict"""
        has_full_name = user.get("first_name", None) and user.get("last_name", None)
        avatar_url = user.get("avatar_url", "")

        if not avatar_url:
            user["avatar_url"] = User.generate_avatar_url(
                f"{user['first_name']} {user['last_name']}" if has_full_name else user["username"]
            )

        return User(**user)
