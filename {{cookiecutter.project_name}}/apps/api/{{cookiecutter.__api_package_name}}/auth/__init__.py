"""The module that contains authentication utilities"""

from typing import Annotated, Optional

from fastapi import Depends, Header
from fastapi.security import OAuth2PasswordBearer

from ..app.exceptions import UnauthorizedException
from ..app.settings import settings
from ..models.user import User
from .abstract_authenticator import AbstractAuthenticator, Authenticated
from .composite_authenticator import CompositeAuthenticator
{%- if cookiecutter.auth == "dummy" %}
from .dummy_authenticator import DummyAuthenticator
{%- elif cookiecutter.auth == "keycloak" %}
from .keycloak_authenticator import KeycloakAuthenticator
{%- elif cookiecutter.auth == "local" %}
from .local_authenticator import LocalAuthenticator
{%- endif %}

__all__ = ["Authenticated", "authenticator", "auth_user_id", "auth_user_token"]


def get_authenticator(provider: str) -> AbstractAuthenticator:
    """Get authenticator instance"""
    provider = provider.lower()

    if provider.startswith(f"{CompositeAuthenticator.NAME}:"):
        sub_providers = provider[len(CompositeAuthenticator.NAME) + 1 :].split(",")
        return CompositeAuthenticator([get_authenticator(p) for p in sub_providers])

    match provider.lower():
        {% if cookiecutter.auth == "dummy" -%}
        case DummyAuthenticator.NAME:
            return DummyAuthenticator()
        {% elif cookiecutter.auth == "keycloak" -%}
        case KeycloakAuthenticator.NAME:
            return KeycloakAuthenticator()
        {% elif cookiecutter.auth == "local" -%}
        case LocalAuthenticator.NAME:
            return LocalAuthenticator()
        {% endif -%}
        case "":
            raise ValueError("No authentication provider selected")
        case _:
            raise ValueError(f"Unknown authentication provider: {provider}")


authenticator = get_authenticator(settings.Auth.provider)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/oauth/token", auto_error=True, description="OAuth2 Bearer Token")


async def auth_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    """Get user ID from JWT token"""
    user = await authenticator.verify_user(token)

    if not user:
        raise UnauthorizedException("Invalid authentication credentials")

    return user


async def auth_user_id(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """Get user ID from JWT token"""
    user_id = await authenticator.verify_user_id(token)

    if not user_id:
        raise UnauthorizedException("Invalid authentication credentials")

    return user_id


async def auth_user_token(authorization: Annotated[Optional[str], Header()] = None) -> str:
    """Get user token from Authorization header"""

    if authorization is None:
        raise UnauthorizedException("No authroization header provided")

    token_prefix, _, token = authorization.partition(" ")

    if token_prefix.lower() != "bearer":
        raise UnauthorizedException("Invalid authentication scheme")
    if not token:
        raise UnauthorizedException("No authroization token provided")

    return token
