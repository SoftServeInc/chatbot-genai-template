"""SQLAlchemy and SQLModel type converters and utilities"""

from enum import StrEnum
from typing import Any, Literal, TypeVar, cast

from sqlalchemy import FromClause
from sqlalchemy.orm import (
    DeclarativeBase,
    DeclarativeMeta,
    Mapped,
    QueryableAttribute,
    noload,
    selectinload,
)
from sqlmodel import col

T = TypeVar("T")


def column(column_expression: T) -> Mapped[T]:
    """Type convet a SQLModel column to a SQLAlchemy column"""
    return col(column_expression)


def relationship(relationship_expression: T) -> QueryableAttribute[T]:
    """Type convet a SQLModel relationship to a SQLAlchemy relationship"""
    if not isinstance(relationship_expression, QueryableAttribute):
        raise RuntimeError(f"Not a SQLAlchemy relationship: {relationship_expression}")
    return relationship_expression


def table(model_class: Any) -> FromClause:
    """Type convert a SQLModel class to a SQLAlchemy ORM base class"""
    if not isinstance(model_class, DeclarativeMeta):
        raise RuntimeError(f"Not a SQLAlchemy ORM base class: {model_class}")
    return cast(type[DeclarativeBase], model_class).__table__  # pylint: disable=no-member


def select_in_load(attribute: T):
    """Type convet a SQLModel relationship to a SQLAlchemy selectinload option"""
    if not isinstance(attribute, QueryableAttribute):
        raise RuntimeError(f"Not a SQLAlchemy relationship: {attribute}")
    return selectinload(attribute)


def no_load(attribute: T | Literal["*"] = "*"):
    """Type convet a SQLModel relationship to a SQLAlchemy noload option"""
    if attribute != "*" and not isinstance(attribute, QueryableAttribute):
        raise RuntimeError(f"Not a SQLAlchemy relationship: {attribute}")
    return noload(attribute)


class Order(StrEnum):
    """The base class for all string enums"""

    ASC: str = "asc"
    DESC: str = "desc"
