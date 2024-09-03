"""API router for User related endpoints"""

from logging import getLogger
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Security
from fastapi.responses import Response

from ....app.exceptions import ForbiddenException
from ....app.schemas import DataRequest, DataResponse, JSONDataResponse, responses
from ....app.settings import settings
from ....auth import auth_user
from ....crud import TermsCRUD
from ....models import TermsVersion, User
from .models import TermsReference

logger = getLogger(__name__)

terms = APIRouter(tags=["terms"])


@terms.post("/terms", responses=responses(401, 403), status_code=201, response_model=DataResponse[TermsVersion])
async def publish_terms_of_service(
    user: Annotated[User, Security(auth_user)],
    request: DataRequest[TermsReference],
    terms_crud: Annotated[TermsCRUD, Depends()],
):
    """Update the terms of service with a new version URL - either activate an existing version with the matching URL or create a new version"""
    if user.username not in settings.Terms.admin_usernames:
        raise ForbiddenException("User is not authorized to update terms of service")

    terms_version = await terms_crud.create(request.data.url)
    return JSONDataResponse(terms_version, 201)


@terms.get("/terms/latest", responses=responses(401, 403, 404), response_model=DataResponse[TermsVersion])
async def get_latest_terms_of_service(terms_crud: Annotated[TermsCRUD, Depends()]):
    """Get the latest version of the terms of service"""
    return JSONDataResponse(await terms_crud.get_latest_version(raise_not_found=True))


@terms.get("/terms/{terms_id}", responses=responses(401, 403, 404), response_model=DataResponse[TermsVersion])
async def get_terms_of_service(
    terms_id: UUID,
    terms_crud: Annotated[TermsCRUD, Depends()],
):
    """Get a specific version of the terms of service"""
    return JSONDataResponse(await terms_crud.get_version_by_id(terms_id, raise_not_found=True))


@terms.post("/terms/{terms_id}/agree", responses=responses(401, 403, 404), status_code=200, response_class=Response)
async def agree_to_terms_of_service(
    user: Annotated[User, Security(auth_user)],
    terms_id: UUID,
    terms_crud: Annotated[TermsCRUD, Depends()],
):
    """Agree to the currently active version of the terms of service"""
    terms_version = await terms_crud.get_version_by_id(terms_id, raise_not_found=True)
    await terms_crud.agree_to_version(terms_version.id, user.id)
