"""Data request schema"""

from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class DataRequest(BaseModel, Generic[T]):
    """Generic data request model"""

    data: T
