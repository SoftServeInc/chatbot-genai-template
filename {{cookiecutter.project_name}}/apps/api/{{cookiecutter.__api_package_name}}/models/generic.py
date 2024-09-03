"""Generic models that are used as a base for other models"""

from typing import Any, Callable, Optional
from uuid import UUID, uuid4

from pydantic import validator
from sqlalchemy.orm.attributes import set_committed_value
from sqlmodel import Column as SQLColumn
from sqlmodel import DateTime as SQLDateTime
from sqlmodel import Field as SQLField
from sqlmodel import SQLModel

from ..common.datetime import datetime, now, to_datetime

TableName = str | Callable[..., str]


class GenericResource(SQLModel):
    """Base model for all models representing an identifiable resource in the application"""

    id: UUID = SQLField(default_factory=uuid4, primary_key=True)
    created_at: datetime = SQLField(
        default_factory=now, sa_column=SQLColumn(SQLDateTime(timezone=True), nullable=False, index=True)
    )
    modified_at: datetime = SQLField(
        default_factory=now, sa_column=SQLColumn(SQLDateTime(timezone=True), nullable=False)
    )
    deleted_at: Optional[datetime] = SQLField(
        default=None,
        sa_column=SQLColumn(SQLDateTime(timezone=True), nullable=True),
        exclude=True,
        schema_extra={"hidden": True},
    )

    class Config:
        @staticmethod
        def schema_extra(schema: dict[str, dict[str, dict[str, Any]]], cls: type["GenericResource"]):
            """Do not include hidden fields in the schema"""
            hidden = getattr(cls, "__hidden__", [])
            schema["properties"] = {
                k: v for k, v in schema.get("properties", {}).items() if not v.pop("hidden", False) and k not in hidden
            }

    @validator("created_at", "modified_at", "deleted_at", pre=True)
    def time_validate(cls, time: Any) -> Optional[datetime]:  # pylint: disable=no-self-argument
        """Parse and validate the value of timestamp fields"""
        if time is None:
            return None

        return to_datetime(time)

    def set_committed_attribute(self, key: str, value: Any) -> None:
        """Set the value of an attribute without marking it as changed"""
        set_committed_value(self, key, value)

    def json_min(self) -> str:
        """Convert the model to a JSON string with the minimum possible whitespace"""
        return self.json(by_alias=True, separators=(",", ":"))
