"""Data response schema"""

from typing import Generic, TypeVar

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic.generics import GenericModel

T = TypeVar("T")


class DataResponse(GenericModel, Generic[T]):
    """Generic data response model"""

    data: T

    def __init__(self, data: T) -> None:
        super().__init__(**{"data": data})


class JSONDataResponse(JSONResponse, Generic[T]):
    """Generic JSON data response - i.e., the actual response, not the model"""

    def __init__(self, data: T, status_code=200) -> None:
        super().__init__(
            content={"data": jsonable_encoder(data, by_alias=True)},
            status_code=status_code,
        )
