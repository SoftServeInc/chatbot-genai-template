"""API router for User related endpoints"""

from logging import getLogger
from typing import Annotated

from fastapi import APIRouter, Depends, Security

from ....app.exceptions import UnauthorizedException
from ....app.schemas import DataRequest, DataResponse, JSONDataResponse, responses
from ....auth import auth_user, authenticator
from ....crud import TermsCRUD
from ....models import User
from .models import AgreedTermsVersion, LoggedIn, LogIn

logger = getLogger(__name__)

users = APIRouter(tags=["users"])


@users.get("/users/me", responses=responses(401, 403), response_model=DataResponse[User])
async def get_me(user: Annotated[User, Security(auth_user)]):
    """Get the current user"""
    return JSONDataResponse(user)


@users.post("/users/login", responses=responses(401, 422), response_model=DataResponse[LoggedIn])
async def login(request: DataRequest[LogIn], terms_crud: Annotated[TermsCRUD, Depends()]):
    """Authenticate a user by their username and password and return an access token if successful"""
    authenticated = await authenticator.authenticate(request.data.username, request.data.password)

    if not authenticated:
        raise UnauthorizedException("Invalid user credentials")

    logged_in = LoggedIn(user=authenticated.user, token=authenticated.token)
    terms_version = await terms_crud.get_latest_version()

    if terms_version:
        logged_in.terms = AgreedTermsVersion(
            **terms_version.dict(),
            agreed=await terms_crud.has_agreed_to_version(terms_version.id, authenticated.user.id),
        )

    return JSONDataResponse(logged_in)
