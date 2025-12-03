"""DTO models for the Chat API endpoints"""

from typing import Optional

from pydantic import BaseModel

from ....models import Chat, ChatBase, Message


class ChatWithMesssages(ChatBase):
    """DTO request model for GET /chats/{chat_id}?include=messages endpoint"""

    messages: list[Message]

    def __init__(self, chat: Chat):
        super().__init__(**(chat.model_dump() | {"messages": chat.messages}))


class CreateChat(BaseModel):
    """DTO request model for the POST /chats endpoint"""

    title: str
    {%- if cookiecutter.enable_rag %}
    rag_enabled: Optional[bool] = None
    {%- endif %}


class UpdateChat(BaseModel):
    """DTO request model for the PATCH /chats/{chat_id} endpoint"""

    title: str
    {%- if cookiecutter.enable_rag %}
    rag_enabled: Optional[bool] = None
    {%- endif %}
