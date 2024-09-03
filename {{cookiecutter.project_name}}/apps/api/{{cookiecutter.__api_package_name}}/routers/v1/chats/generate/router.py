"""API router for Chat related endpoints"""

from logging import getLogger
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Security

from .....ai import SubjectLineAssistant
from .....app.exceptions import BadRequestException
from .....app.schemas import DataResponse, JSONDataResponse, responses
from .....auth import auth_user_id
from .....crud import ChatCRUD
from .models import GeneratedTitle

logger = getLogger(__name__)

generate = APIRouter()


@generate.post(
    "/chats/{chat_id}/generate-title",
    responses=responses(401, 403, 404, 422),
    response_model=DataResponse[GeneratedTitle],
)
async def chat_generate_title(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    chat_crud: Annotated[ChatCRUD, Depends()],
    assistant: Annotated[SubjectLineAssistant, Depends()],
):
    """Generate a title for a chat based on its messages"""
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, include_messages=True, raise_not_found=True)

    if len(chat.messages) < 2:
        raise BadRequestException("Title can only be generated for a chat with at least 2 messages")

    chat.title = await assistant.generate(chat.messages)
    await chat_crud.save(chat)

    return JSONDataResponse(GeneratedTitle(title=chat.title))
