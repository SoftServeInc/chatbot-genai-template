"""Common utility functions"""

import asyncio
import functools
import json
import logging
from random import uniform
from types import EllipsisType
from typing import Any, Callable, Coroutine, Iterable, Optional, TypeVar

T = TypeVar("T")
K = TypeVar("K")


logger = logging.getLogger(__name__)


async def retry_with_backoff(
    callback: Callable[..., Coroutine[None, None, T]],
    *args,
    max_retries: int = 3,
    backoff_in_seconds: int = 1,
    **kwargs,
) -> T:
    """Retry a function with exponential backoff"""
    retry_number = 0

    while True:
        try:
            return await callback(*args, **kwargs)
        except Exception:
            if retry_number == max_retries:
                raise

            delay = backoff_in_seconds * 2**retry_number + uniform(0, 1)
            await asyncio.sleep(delay)

            retry_number += 1


def without(dictionary: dict[T, K], *args) -> dict[T, K]:
    """Returns the dictionary without the specified keys"""
    for key in args:
        dictionary.pop(key, None)

    return dictionary


def find_first(
    iterable: Iterable[T],
    where: Callable[[T], bool] = bool,
    default: Optional[T | EllipsisType] = ...,
) -> Optional[T]:
    """Returns the first element in the iterable that matches the where condition"""
    try:
        return next(x for x in iterable if where(x))
    except StopIteration as exc:
        if not isinstance(default, EllipsisType):
            return default
        raise ValueError("No element found matching the where condition") from exc


def json_print(obj: Any) -> None:
    """Prints a JSON object with indentation"""
    print(json.dumps(obj, indent=2, sort_keys=False))


def json_dump_min(obj: Any) -> str:
    """Returns a JSON string with no indentation"""
    return json.dumps(obj, separators=(",", ":"))


def rsetattr(obj: object, attr: str, val: Any) -> None:
    """Set attribute recursively"""
    pre, _, post = attr.rpartition(".")
    setattr(rgetattr(obj, pre) if pre else obj, post, val)


def rgetattr(obj: object, attr: str, default: Any = ...) -> Any:
    """Get attribute recursively"""

    def _getattr(obj, attr):
        return getattr(obj, attr) if default is Ellipsis else getattr(obj, attr, default)

    return functools.reduce(_getattr, [obj] + attr.split("."))


def _str(x: str) -> str:
    """Identity function that returns the argument"""
    return x


def parse_csv_string(string: str) -> list[str]:
    """Parse a comma-separated string into a list"""
    values: list[str] = []

    for value in string.split(","):
        value = value.strip()
        if value:
            values.append(value)

    return values
