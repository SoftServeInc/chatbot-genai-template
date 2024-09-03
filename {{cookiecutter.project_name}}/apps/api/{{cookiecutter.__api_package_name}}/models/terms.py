"""Generic models that are used as a base for other models"""

from typing import ClassVar
from uuid import UUID, uuid4

from pydantic import HttpUrl
from sqlmodel import Column as SQLColumn
from sqlmodel import DateTime as SQLDateTime
from sqlmodel import Field as SQLField
from sqlmodel import Relationship as SQLRelationship
from sqlmodel import SQLModel

from ..common.datetime import datetime, now
from .generic import TableName


class TermsVersionBase(SQLModel):
    """The base model for the terms of service"""

    id: UUID = SQLField(default_factory=uuid4, primary_key=True)
    url: HttpUrl = SQLField(
        nullable=False, index=True, schema_extra={"example": "https://www.softserveinc.com/en-us/terms-and-conditions"}
    )
    published_at: datetime = SQLField(
        default_factory=now, sa_column=SQLColumn(SQLDateTime(timezone=True), nullable=False, index=True)
    )


class TermsVersion(TermsVersionBase, table=True):
    """The model representing the terms of service"""

    __tablename__: ClassVar[TableName] = "terms_versions"

    agreements: list["TermsVersionAgreement"] = SQLRelationship(back_populates="terms_version")


class TermsVersionAgreement(SQLModel, table=True):
    """The model representing the terms of service that a user has agreed to"""

    __tablename__: ClassVar[TableName] = "terms_version_agreements"

    # https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html
    terms_version: TermsVersion = SQLRelationship(back_populates="agreements", sa_relationship_kwargs={"lazy": "raise"})

    terms_version_id: UUID = SQLField(nullable=False, primary_key=True, foreign_key="terms_versions.id")
    user_id: str = SQLField(nullable=False, primary_key=True)
    agreed_at: datetime = SQLField(default_factory=now, sa_column=SQLColumn(SQLDateTime(timezone=True), nullable=False))
