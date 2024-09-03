"""Query parameter definitions for the Chat API endpoints"""

from typing import Annotated

from fastapi import Query


class IncludeQuery:
    """Query parameter for including chat messages in the response; for example, 'include=messages' or 'include=messages,users'"""

    values: list[str]

    def __init__(
        self, include: Annotated[str, Query(alias="include", description="Include chat messages")] = ""
    ) -> None:
        self.values = [value for value in [v.strip() for v in include.split(",")] if value] if include else []

    def has(self, value: str) -> bool:
        """Check if the given value is included in the "include" query parameter"""
        return value in self.values
