"""The module that contains the chat CRUD service"""

from typing import Literal, Optional, overload
from uuid import UUID

from sqlmodel import select

from ..app.schemas import Paginated, PaginationQuery
from ..common.sql import column, select_in_load
from ..models import Chat, Message
from .abstract_crud import AbstractCRUD, AsyncSession, Query


class ChatCRUD(AbstractCRUD[Chat]):
    """Service for chat related operations"""

    def __init__(self, session: AsyncSession):
        super().__init__(Chat, session)

    @overload
    async def get_by_id_for_user(
        self, chat_id: UUID, user_id: str, *, include_messages: bool = False, raise_not_found: Literal[True]
    ) -> Chat: ...

    @overload
    async def get_by_id_for_user(
        self, chat_id: UUID, user_id: str, *, include_messages: bool = False, raise_not_found: bool = False
    ) -> Optional[Chat]: ...

    async def get_by_id_for_user(
        self,
        chat_id: UUID,
        user_id: str,
        *,
        include_messages: bool = False,
        raise_not_found: bool = False,
    ) -> Optional[Chat]:
        """Get a chat by its ID belonging to a user"""

        def adjust_query(query: Query[Chat]) -> Query[Chat]:
            if include_messages:
                query = query.options(select_in_load(Chat.messages))

            return query.where(Chat.user_id == user_id)

        return await self.get_by_id(chat_id, adjust_query, raise_not_found=raise_not_found)

    async def get_all_for_user_paginated(
        self, user_id: str, pagination: PaginationQuery, *, include_messages: bool = False
    ) -> Paginated[Chat]:
        """Get all chats belonging to a user"""

        def adjust_query(query: Query[Chat]) -> Query[Chat]:
            return query.where(Chat.user_id == user_id)

        paginated = await self.get_all_paginated(pagination, adjust_query)

        if include_messages:
            # When include_messages is True, we need to load only one last message for each chat
            query = (
                select(Message)
                .distinct(column(Message.chat_id))
                .where(
                    column(Message.deleted_at).is_(None),
                    column(Message.chat_id).in_(chat.id for chat in paginated.items),
                )
                .order_by(column(Message.chat_id), column(Message.created_at).desc())
            )

            messages = (await self.session.exec(query)).all()

            for chat in paginated.items:
                chat.set_committed_attribute(
                    "messages", [message for message in messages if message.chat_id == chat.id]
                )

        return paginated

    async def load_message_chat(self, message: Message) -> Optional[Chat]:
        """Load the chat of a message"""
        chat = await self.get_by_id(message.chat_id)

        if chat is not None:
            message.set_committed_attribute("chat", chat)

        return chat
