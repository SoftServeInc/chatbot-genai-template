"""DTO models for the Chat Converse API endpoints"""

from typing import ClassVar

from pydantic import BaseModel, Field

from .....common.utils import without
from .....models import Message, MessageBase, MessageSegmentType


class ConverseUserMessage(MessageBase):
    """DTO response model for POST /chats/{chat_id}/converse endpoint"""

    __hidden__: ClassVar[list[str]] = ["segments", "feedback_rating"]

    class Config:
        fields = {"segments": {"exclude": True}}

    def __init__(self, message: Message):
        super().__init__(**without(message.dict(), "segments"))


class ConverseChatSegment(BaseModel):
    """A single item (segment) of the DTO request model (which is a list of segments) for POST /chats/{chat_id}/converse endpoint"""

    type: MessageSegmentType
    content: str = Field(max_length=1000)


class ConverseChat(BaseModel):
    """DTO resprequestonse model for POST /chats/{chat_id}/converse endpoint"""

    __root__: list[ConverseChatSegment]

    @property
    def segments(self) -> list[ConverseChatSegment]:
        """Returns the segments of the chat message sent by the user"""
        return self.__root__

    @property
    def text(self) -> str:
        """Returns the concatenated text content of all segments of the chat message sent by the user"""
        return "\n".join(segment.content for segment in self.segments if segment.type == MessageSegmentType.TEXT)
