"""The module that contains the abstract base CRUD service"""

from typing import (
    Annotated,
    Callable,
    Generic,
    Literal,
    Optional,
    TypeVar,
    cast,
    overload,
)
from uuid import UUID

from fastapi import Depends
from sqlalchemy.orm import DeclarativeBase
from sqlmodel import func, select
from sqlmodel.sql.expression import SelectOfScalar

from ..app.db import AsyncSession as AsyncDBSession
from ..app.db import get_session
from ..app.exceptions import NotFoundException
from ..app.schemas import Paginated, PaginationQuery
from ..common.datetime import now
from ..common.sql import Order, column, no_load
from ..models.generic import GenericResource

AsyncSession = Annotated[AsyncDBSession, Depends(get_session)]
Query = SelectOfScalar

T = TypeVar("T", bound=GenericResource)


class AbstractCRUD(Generic[T]):
    """The abstract base service class for all other services"""

    session: AsyncSession
    model_class: type[T]

    def __init__(self, model_class: type[T], session: AsyncSession):
        self.session = session
        self.model_class = model_class

    async def _commit(self, commit: bool = True) -> None:
        if commit:
            await self.session.commit()

    @overload
    async def get_by_id(
        self,
        resource_id: UUID | str,
        adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None,
        *,
        raise_not_found: Literal[True],
    ) -> T: ...

    @overload
    async def get_by_id(
        self,
        resource_id: UUID | str,
        adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None,
        *,
        raise_not_found: bool = False,
    ) -> Optional[T]: ...

    async def get_by_id(
        self,
        resource_id: UUID | str,
        adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None,
        *,
        raise_not_found: bool = False,
    ) -> Optional[T]:
        """Get a resource by its ID"""
        query = select(self.model_class).where(
            self.model_class.id == resource_id, column(self.model_class.deleted_at).is_(None)
        )

        if adjust_query is not None:
            query = adjust_query(query)

        result = await self.session.exec(query)
        record = result.first()

        if not record and raise_not_found:
            raise NotFoundException(f"Resource Not Found: {self.model_class.__name__} with ID '{resource_id}'")

        return record

    async def get_by_ids(
        self, resource_ids: list[UUID | str], adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None
    ) -> list[T]:
        """Get a list of resources by their IDs"""
        query = select(self.model_class).where(
            column(self.model_class.id).in_(resource_ids), column(self.model_class.deleted_at).is_(None)
        )

        if adjust_query is not None:
            query = adjust_query(query)

        result = await self.session.exec(query)
        return list(result.all())

    async def get_count(self, adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None) -> int:
        """Get the total number of resources"""
        query = select(self.model_class).where(column(self.model_class.deleted_at).is_(None))

        if adjust_query is not None:
            query = adjust_query(query)

        query = query.order_by(None).options(no_load("*"))
        result = await self.session.exec(
            select(func.count()).select_from(query.subquery())  # pylint: disable=not-callable
        )

        return result.first() or 0

    async def does_exist(self, adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None) -> bool:
        """Check if a resource exists"""

        def adjust_query_(query: Query[T]) -> Query[T]:
            return (adjust_query(query) if adjust_query else query).limit(1)

        return await self.get_count(adjust_query_) > 0

    async def get_all(  # pylint: disable=too-many-arguments
        self,
        adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None,
        *,
        offset: int = 0,
        limit: int = 0,
        order_by: str | None = "created_at",
        order: Optional[Order] = Order.DESC,
    ) -> list[T]:
        """Get a list of all resources"""
        query = select(self.model_class).where(column(self.model_class.deleted_at).is_(None))

        if offset > 0:
            query = query.offset(offset)
        if limit > 0:
            query = query.limit(limit)

        columns = cast(type[DeclarativeBase], self.model_class).__table__.columns

        if order_by:
            if order_by not in columns:
                order_by = "created_at"

            query = query.order_by(columns[order_by].asc() if order == Order.ASC else columns[order_by].desc())

        if adjust_query is not None:
            query = adjust_query(query)

        result = await self.session.exec(query)
        return list(result.all())

    async def get_all_paginated(
        self,
        pagination: PaginationQuery,
        adjust_query: Optional[Callable[[Query[T]], Query[T]]] = None,
        *,
        order_by: str | None = "created_at",
        order: Optional[Order] = Order.DESC,
    ) -> Paginated[T]:
        """Get a paginated list of all resources"""
        query = select(self.model_class).where(column(self.model_class.deleted_at).is_(None))
        columns = cast(type[DeclarativeBase], self.model_class).__table__.columns

        if order_by:
            if order_by not in columns:
                order_by = "created_at"

            query = query.order_by(columns[order_by].asc() if order == Order.ASC else columns[order_by].desc())

        if adjust_query is not None:
            query = adjust_query(query)

        total = await self.get_count(adjust_query=adjust_query)

        if pagination.offset > 0:
            query = query.offset(pagination.offset)
        if pagination.limit > 0:
            query = query.limit(pagination.limit)

        result = await self.session.exec(query)
        return Paginated(list(result.all()), total, pagination)

    async def save(self, model: T, *, modified: bool = True, commit: bool = True) -> None:
        """Save new or update existing resource"""
        if modified:
            model.modified_at = now()

        self.session.add(model)

        await self._commit(commit)

    async def save_all(self, *models: T, modified: bool = True, commit: bool = True) -> None:
        """Save new or update existing resources"""
        if modified:
            modified_at = now()
            for model in models:
                model.modified_at = modified_at

        self.session.add_all(models)

        await self._commit(commit)

    async def delete(self, model: T, *, commit: bool = True) -> None:
        """Soft delete a resource"""
        model.deleted_at = now()
        self.session.add(model)

        await self._commit(commit)
