"""Helper functions for manipulating datetime objects"""

from datetime import datetime, timedelta, timezone
from typing import Optional


def epoch() -> datetime:
    """Return a datetime object for the UNIX epoch start"""
    return datetime(1970, 1, 1, tzinfo=timezone.utc)


def now() -> datetime:
    """Return a datetime object for the current time in UTC"""
    return datetime.now(timezone.utc)


def ymdhms(value: datetime) -> str:
    """Return a datetime object as a string in the format YYYYMMDDHHMMSSfff"""
    return value.strftime("%Y%m%d%H%M%S%f")[:-3]


def iso(value: Optional[datetime] = None) -> str:
    """Return a datetime object as a string in ISO format, with milliseconds precision YYYY-MM-DDTHH:MM:SS.fffZ"""
    formatted = (now() if value is None else value).isoformat(timespec="milliseconds")
    return f"{formatted[:-6]}Z" if formatted[-6:] == "+00:00" else formatted


def from_iso(value: str) -> datetime:
    """Return a datetime object from a string in ISO format"""
    return datetime.fromisoformat(f"{value[:-1]}+00:00" if value[-1] == "Z" else value)


def unix_timestamp(value: datetime) -> int:
    """Return a UNIX timestamp in milliseconds from a datetime object"""
    return int(round(value.timestamp() * 1000))


def from_unix_timestamp(value: int) -> datetime:
    """Return a datetime object from a UNIX timestamp in milliseconds"""
    return datetime.fromtimestamp(value * 0.001, timezone.utc)


def seconds_from_now(seconds: int) -> datetime:
    """Return a datetime object from a number of seconds from now"""
    return now() + timedelta(seconds=seconds)


def years_diff(value1: datetime, value2: datetime) -> int:
    """Return the difference in years between two datetime objects"""
    return (value1.year - value2.year) - int((value1.month, value1.day) < (value2.month, value2.day))


def years_since(value: datetime):
    """Return the number of years since a datetime object"""
    return years_diff(datetime.today(), value)


def to_datetime(time: str | int | datetime) -> datetime:
    """Parse and validate the datetime value"""
    if isinstance(time, str):
        return from_iso(time)

    if isinstance(time, int):
        return from_unix_timestamp(time)

    if isinstance(time, datetime):
        return time

    raise ValueError("Datetime value has invalid format")
