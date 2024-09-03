"""Chat message related models"""

from enum import StrEnum
from typing import TYPE_CHECKING, ClassVar, Literal, Self
from uuid import UUID

from langchain.schema import AIMessage, BaseMessage, HumanMessage
from sqlalchemy.dialects.postgresql import ENUM as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB as SQL_JSONB
from sqlmodel import Column as SQLColumn
from sqlmodel import Field as SQLField
from sqlmodel import Relationship as SQLRelationship

from .generic import GenericResource, TableName

if TYPE_CHECKING:
    from .chat import Chat


class MessageSegmentType(StrEnum):
    """The possible types of a chat message segment"""

    TEXT: str = "text"
    ACTION: str = "action"


class MessageRole(StrEnum):
    """The possible types of a chat message"""

    USER: str = "user"
    ASSISTANT: str = "assistant"


_MessageSegment = dict[Literal["type", "content"], str]


class MessageSegment(_MessageSegment):
    """
    The model representing a single chat message segment of a specific type
    We have to inherit from dict to make it JSON serializable so that it can be stored to JSONB columns
    """

    def __init__(self, type: str, content: str):  # pylint: disable=redefined-builtin
        self["type"] = type
        self["content"] = content

    @classmethod
    def text(cls, content: str) -> Self:
        """Create a text message segment"""
        return cls(MessageSegmentType.TEXT, content)

    @property
    def type(self) -> str:
        """The type of the message segment"""
        return self.get("type", MessageSegmentType.TEXT)

    @property
    def content(self) -> str:
        """The content of the message segment"""
        return self.get("content", "")


class MessageBase(GenericResource):
    """The base model representing a chat message with its role and content"""

    chat_id: UUID = SQLField(foreign_key="chats.id")
    role: MessageRole = SQLField(sa_column=SQLColumn(SQLEnum(MessageRole, name="message_role"), nullable=False))
    segments: list[_MessageSegment] = SQLField(
        default_factory=list,
        sa_column=SQLColumn(SQL_JSONB, nullable=False),
        schema_extra={
            "examples": [
                [
                    {
                        "type": "text",
                        "content": "Hello my Friend!",
                    },
                    {
                        "type": "text",
                        "content": "\n\nHow are you doing?",
                    },
                ]
            ]
        },
    )
    in_progress: bool = SQLField(default=False)
    feedback_rating: int = SQLField(default=0)
    feedback_comment: str = SQLField(default="", exclude=True, schema_extra={"hidden": True})

    def _iter(self, *args, **kwargs):
        """Exclude the feedback rating from the serialized model if the role is a user"""
        exclude = kwargs.pop("exclude", None)

        if exclude is None:
            exclude = set()
        if self.role == MessageRole.USER:
            exclude.add("feedback_rating")

        kwargs["exclude"] = exclude

        return super()._iter(*args, **kwargs)

    def to_langchain_message(self) -> BaseMessage:
        """Convert the message model to a langchain message"""
        return (
            AIMessage(content=self.content)
            if self.role == MessageRole.ASSISTANT
            else HumanMessage(content=self.content)
        )

    @property
    def content(self) -> str:
        """The content of the message which is the concatenated content of all text segments"""
        return "".join(segment.content for segment in self.segments_typed if segment.type == MessageSegmentType.TEXT)

    @property
    def segments_typed(self) -> list[MessageSegment]:
        """
        We have to manually parse message segments
        Custom validators/transformers don't work for SQLModel classes because of this issue:
        https://github.com/tiangolo/sqlmodel/issues/52#issuecomment-1311987732
        """
        return [
            MessageSegment(segment.get("type", MessageSegmentType.TEXT), segment.get("content", ""))
            for segment in self.segments
        ]


class Message(MessageBase, table=True):
    """The database persisted model representing a chat message"""

    __tablename__: ClassVar[TableName] = "messages"

    # https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html
    chat: "Chat" = SQLRelationship(back_populates="messages", sa_relationship_kwargs={"lazy": "raise"})
