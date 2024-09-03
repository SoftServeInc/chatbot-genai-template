"""Environment variable helper functions"""

from os import environ
from typing import Callable, Optional, TypeVar

T = TypeVar("T")


def env_bool(var_name: str, default: Optional[bool] = False) -> bool:
    """Convert the environment variable value to a boolean"""
    return _get(var_name, default, lambda str: str.lower() in ["true", "yes", "1", "t", "y"])


def env_str(var_name: str, default: Optional[str] = "") -> str:
    """Convert the environment variable value to a string"""
    return _get(var_name, default, str)


def env_int(var_name: str, default: Optional[int] = 0) -> int:
    """Convert the environment variable value to a string"""

    return _get(var_name, default, int)


def env_float(var_name: str, default: Optional[float] = 0.0) -> float:
    """Convert the environment variable value to a string"""
    return _get(var_name, default, float)


def _get(var_name: str, default: Optional[T], converter: Callable[[str], T]) -> T:
    """
    Returns the value of the given environment variable
    or raises an exception if it is not set and default is set to None
    """
    value: str = environ.get(var_name, "")

    if default is None:
        if not value:
            raise ValueError(f"Environment variable {var_name} is not set")
        return converter(value)

    return converter(value) if value else default
