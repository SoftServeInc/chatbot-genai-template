"""Data request schema"""

from typing import Generic, TypeVar

from pydantic.generics import GenericModel

T = TypeVar("T")


class DataRequest(GenericModel, Generic[T]):
    """Generic data request model"""

    data: T
