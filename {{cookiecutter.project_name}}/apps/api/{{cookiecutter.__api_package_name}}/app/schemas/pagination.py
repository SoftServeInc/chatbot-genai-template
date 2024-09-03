"""Pagination schema and helper classes"""

from typing import Annotated, Callable, Generic, TypeVar

from fastapi import Query

T = TypeVar("T")
V = TypeVar("V")


class PaginationQuery:
    """Pagination query parameter schema"""

    offset: int
    limit: int

    def __init__(
        self,
        offset: Annotated[
            int,
            Query(ge=0, example=0, alias="page[offset]", description="The offset of the first item to be returned."),
        ] = 0,
        limit: Annotated[
            int,
            Query(
                ge=0,
                le=1000,
                example=10,
                alias="page[limit]",
                description="The maximum number of items to be returned; set to 0 fo no limit.",
            ),
        ] = 10,
    ) -> None:
        self.offset = offset
        self.limit = limit


class Paginated(Generic[T]):
    """Paginated object containing a list of items and pagination metadata including the original query"""

    items: list[T]
    total: int
    query: PaginationQuery

    def __init__(self, items: list[T], total: int, query: PaginationQuery) -> None:
        self.items = items
        self.total = total
        self.query = query

    def map(self, func: Callable[[T], V]) -> "Paginated[V]":
        """Return a new paginated object with the items mapped by the given function"""
        return Paginated([func(item) for item in self.items], self.total, self.query)
