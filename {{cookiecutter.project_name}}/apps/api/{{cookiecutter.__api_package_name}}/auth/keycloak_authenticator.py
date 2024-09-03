"""The module that contains local authenticator implementation"""

from typing import Any, ClassVar, Optional

from jwcrypto.jwk import JWK
from keycloak import KeycloakOpenID

from ..app.settings import settings
from ..models.user import User
from .abstract_authenticator import AbstractAuthenticator, Authenticated


class KeycloakAuthenticator(AbstractAuthenticator):
    """Keycloak authenticator that uses self-hosted Keycloak as an identity provider"""

    NAME: ClassVar[str] = "keycloak"

    USERNAME_BLACKLIST: ClassVar[list[str]] = ["admin"]

    _openid: KeycloakOpenID
    _public_key: Optional[JWK] = None
    _check_claims: dict[str, Any]

    def __init__(self) -> None:
        self._openid = KeycloakOpenID(
            server_url=settings.Auth.Keycloak.server_url,
            client_id=settings.Auth.Keycloak.client_id,
            realm_name=settings.Auth.Keycloak.realm_name,
            client_secret_key=settings.Auth.Keycloak.client_secret,
            verify=True,
        )

        self._check_claims = {"exp": None, "email_verified": True, "aud": self._openid.client_id}

    async def authenticate(self, username: str, password: str) -> Optional[Authenticated]:
        """Authenticate user by username and password and return a tuple of user data and access token"""
        if not username or not password or username.strip().lower() in self.USERNAME_BLACKLIST:
            return None

        try:
            response = self._openid.token(username, password, grant_type=["password"])
        except Exception:
            return None

        token = response.get("id_token", "")
        if not token:
            return None

        user = self._build_user_model(self.decode_token(token))

        return Authenticated(user, token)

    async def verify_user(self, token: str) -> Optional[User]:
        """Verify access token and return the user if token is valid or None otherwise"""
        try:
            return self._build_user_model(self.decode_token(token))
        except Exception:
            return None

    async def verify_user_id(self, token: str) -> Optional[str]:
        """Verify access token and return the user ID if token is valid or None otherwise"""
        try:
            return str(self.decode_token(token).get("sub", ""))
        except Exception:
            return None

    def decode_token(self, token: str) -> dict[str, Any]:
        """Decode access token and return user data if token is valid or None otherwise"""
        claims = self._openid.decode_token(
            token,
            validate=True,
            key=self.get_public_key(),
            check_claims=self._check_claims,
        )
        assert isinstance(claims, dict)
        return claims

    def get_public_key(self) -> JWK:
        """Get public key from Keycloak and return it as a JWK object"""
        if self._public_key is None:
            pem = f"-----BEGIN PUBLIC KEY-----\n{self._openid.public_key()}\n-----END PUBLIC KEY-----"
            self._public_key = JWK.from_pem(pem.encode("utf-8"))

        return self._public_key

    def _build_user_model(self, claims: dict[str, Any]) -> User:
        return User(
            id=claims["sub"],
            username=claims["preferred_username"],
            first_name=claims["given_name"],
            last_name=claims["family_name"],
            avatar_url=User.generate_avatar_url(f"{claims['given_name']} {claims['family_name']}"),
        )
