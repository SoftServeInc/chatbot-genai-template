"""Chat related models"""

from typing import ClassVar

from sqlmodel import Field as SQLField
from sqlmodel import Relationship as SQLRelationship

from .generic import GenericResource, TableName
from .message import Message


class ChatBase(GenericResource):
    """The base model representing a chat of a user talking to an AI assistant"""

    user_id: str = SQLField()
    title: str = SQLField(default="")


class Chat(ChatBase, table=True):
    """The database persisted model representing a chat"""

    __tablename__: ClassVar[TableName] = "chats"

    # https://docs.sqlalchemy.org/en/20/orm/queryguide/relationships.html
    # https://docs.sqlalchemy.org/en/20/orm/join_conditions.html#specifying-alternate-join-conditions
    messages: list[Message] = SQLRelationship(
        back_populates="chat",
        sa_relationship_kwargs={
            "primaryjoin": "and_(Chat.id == Message.chat_id, Message.deleted_at == None)",
            "order_by": "Message.created_at.desc()",
        },
    )
