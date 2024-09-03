"""The module that contains the message CRUD service"""

from typing import Literal, Optional, overload
from uuid import UUID

from ..common.sql import relationship
from ..models import Chat, Message
from .abstract_crud import AbstractCRUD, AsyncSession, Query


class MessageCRUD(AbstractCRUD[Message]):
    """Service for message related operations"""

    def __init__(self, session: AsyncSession):
        super().__init__(Message, session)

    @overload
    async def get_by_id_for_user(
        self, message_id: UUID, user_id: str, *, raise_not_found: Literal[True]
    ) -> Message: ...

    @overload
    async def get_by_id_for_user(
        self, message_id: UUID, user_id: str, *, raise_not_found: bool = False
    ) -> Optional[Message]: ...

    async def get_by_id_for_user(
        self, message_id: UUID, user_id: str, raise_not_found: bool = False
    ) -> Optional[Message]:
        """Get a message by its ID belonging to a user"""

        def adjust_query(query: Query[Message]) -> Query[Message]:
            return query.where(relationship(Message.chat).has(user_id=user_id))

        return await self.get_by_id(message_id, adjust_query, raise_not_found=raise_not_found)

    async def get_all_for_chat(self, chat_id: UUID) -> list[Message]:
        """Get all messages belonging to a chat"""

        def adjust_query(query: Query[Message]) -> Query[Message]:
            return query.where(Message.chat_id == chat_id)

        return await self.get_all(adjust_query)

    async def load_chat_messages(self, chat: Chat) -> list[Message]:
        """Load all messages belonging to a chat"""
        messages = await self.get_all_for_chat(chat.id)

        for message in messages:
            message.set_committed_attribute("chat", chat)

        chat.set_committed_attribute("messages", messages)
        return messages
