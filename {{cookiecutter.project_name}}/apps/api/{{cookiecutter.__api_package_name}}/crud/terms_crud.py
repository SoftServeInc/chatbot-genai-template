"""The module that contains the terms CRUD service"""

from typing import Literal, Optional, overload
from uuid import UUID

from pydantic import HttpUrl
from sqlmodel import func, select

from ..app.exceptions import NotFoundException
from ..common.sql import column
from ..models.terms import TermsVersion, TermsVersionAgreement
from .abstract_crud import AsyncSession


class TermsCRUD:
    """Service for terms related operations"""

    session: AsyncSession

    def __init__(self, session: AsyncSession):
        self.session = session

    @overload
    async def get_version_by_id(self, version_id: UUID, raise_not_found: Literal[True]) -> TermsVersion: ...

    @overload
    async def get_version_by_id(self, version_id: UUID, raise_not_found: bool = False) -> Optional[TermsVersion]: ...

    async def get_version_by_id(self, version_id: UUID, raise_not_found: bool = False) -> Optional[TermsVersion]:
        """Get a terms version by its URL"""
        version = await self.session.get(TermsVersion, version_id)

        if version is None and raise_not_found:
            raise NotFoundException(f"Terms version with ID {version_id} not found")

        return version

    @overload
    async def get_latest_version(self, raise_not_found: Literal[True]) -> TermsVersion: ...

    @overload
    async def get_latest_version(self, raise_not_found: bool = False) -> Optional[TermsVersion]: ...

    async def get_latest_version(self, raise_not_found: bool = False) -> Optional[TermsVersion]:
        """Get the latest terms version"""
        result = await self.session.exec(
            select(TermsVersion).order_by(column(TermsVersion.published_at).desc()).limit(1)
        )

        version = result.first()

        if version is None and raise_not_found:
            raise NotFoundException("No terms of service are currently available")

        return version

    async def agree_to_version(self, terms_version_id: UUID, user_id: str) -> TermsVersionAgreement:
        """Agree to a terms version"""
        agreement = await self.session.get(TermsVersionAgreement, (terms_version_id, user_id))

        if agreement is None:
            agreement = TermsVersionAgreement(terms_version_id=terms_version_id, user_id=user_id)
            self.session.add(agreement)
            await self.session.commit()

        return agreement

    async def has_agreed_to_version(self, terms_version_id: UUID, user_id: str) -> bool:
        """Check if a user has agreed to a terms version"""
        query = (
            select(TermsVersionAgreement)
            .where(
                TermsVersionAgreement.terms_version_id == terms_version_id,
                TermsVersionAgreement.user_id == user_id,
            )
            .limit(1)
        )

        result = await self.session.exec(
            select(func.count()).select_from(query.subquery())  # pylint: disable=not-callable
        )

        count = result.first() or 0
        return count > 0

    async def create(self, url: HttpUrl) -> TermsVersion:
        """Activate a terms version"""
        version = TermsVersion(url=url)
        self.session.add(version)

        await self.session.commit()

        return version
