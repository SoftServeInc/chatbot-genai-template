"""Paginated response models"""

from typing import Generic, TypeVar

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

from .pagination import Paginated

T = TypeVar("T")


class PaginatedResponseMetaPage(BaseModel):
    """Page metadata for a paginated response model"""

    offset: int = Field(..., description="The index of the first item in the current page")
    limit: int = Field(..., description="The number of items that were requested")
    total: int = Field(..., description="The total number of items in the collection")


class PaginatedResponseMeta(BaseModel):
    """Metadata for a paginated response model"""

    page: PaginatedResponseMetaPage


class PaginatedResponse(GenericModel, Generic[T]):
    """Generic paginated response model"""

    meta: PaginatedResponseMeta
    data: list[T]

    def __init__(self, paginated: Paginated[T]) -> None:
        super().__init__(
            **{
                "meta": _paginated_meta(paginated),
                "data": _paginated_data(paginated),
            }
        )


class JSONPaginatedResponse(JSONResponse, Generic[T]):
    """Generic JSON paginated response - i.e., the actual response, not the model"""

    def __init__(self, paginated: Paginated[T]) -> None:
        super().__init__(
            {
                "meta": jsonable_encoder(_paginated_meta(paginated), by_alias=True),
                "data": jsonable_encoder(_paginated_data(paginated), by_alias=True),
            }
        )


def _paginated_data(paginated: Paginated[T]):
    """Get paginated data from a paginated object"""
    return paginated.items


def _paginated_meta(paginated: Paginated[T]):
    """Get paginated metadata from a paginated object"""
    return PaginatedResponseMeta(
        page=PaginatedResponseMetaPage(
            offset=paginated.query.offset,
            limit=paginated.query.limit,
            total=paginated.total,
        ),
    )
