"""API router for Chat related endpoints"""

from logging import getLogger
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Response, Security

from ....app.schemas import (
    DataRequest,
    DataResponse,
    JSONDataResponse,
    JSONPaginatedResponse,
    PaginatedResponse,
    PaginationQuery,
    responses,
)
from ....auth import auth_user_id
from ....crud import ChatCRUD
from ....models import Chat, Message
from .converse.router import converse
from .generate.router import generate
from .models import ChatWithMesssages, CreateChat, UpdateChat
from .query import IncludeQuery

logger = getLogger(__name__)

chats = APIRouter(tags=["chats"])


@chats.post(
    "/chats", responses=responses(401, 403, 422), status_code=201, response_model=DataResponse[ChatWithMesssages]
)
async def create_chat(
    user_id: Annotated[str, Security(auth_user_id)],
    request: DataRequest[CreateChat],
    chat_crud: Annotated[ChatCRUD, Depends()],
):
    """Create a new chat"""
    chat = Chat(user_id=user_id, title=request.data.title, messages=[])

    await chat_crud.save(chat, modified=False)

    return JSONDataResponse(ChatWithMesssages(chat), 201)


@chats.get(
    "/chats",
    responses=responses(401, 403),
    response_model=PaginatedResponse[Chat | ChatWithMesssages],
    description=(
        "Get a paginated list of all chats for the current user.\n\n"
        "**IMPORTANT:** when `include=messages` query parameter is passed then only one last message for each chat will be returned."
    ),
)
async def get_chats(
    user_id: Annotated[str, Security(auth_user_id)],
    include: Annotated[IncludeQuery, Depends()],
    pagination: Annotated[PaginationQuery, Depends()],
    chat_crud: Annotated[ChatCRUD, Depends()],
):
    """Get a paginated list of all chats for the current user"""
    include_messages = include.has("messages")
    paginated = await chat_crud.get_all_for_user_paginated(user_id, pagination, include_messages=include_messages)

    return JSONPaginatedResponse(paginated.map(ChatWithMesssages) if include_messages else paginated)


@chats.get(
    "/chats/{chat_id}", responses=responses(401, 403, 404), response_model=DataResponse[Chat | ChatWithMesssages]
)
async def get_chat(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    include: Annotated[IncludeQuery, Depends()],
    chat_crud: Annotated[ChatCRUD, Depends()],
):
    """Get a single chat by its ID"""
    include_messages = include.has("messages")
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, include_messages=include_messages, raise_not_found=True)

    return JSONDataResponse(ChatWithMesssages(chat) if include_messages else chat)


@chats.patch("/chats/{chat_id}", responses=responses(401, 403, 404, 422), response_model=DataResponse[Chat])
async def update_chat(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    request: DataRequest[UpdateChat],
    chat_crud: Annotated[ChatCRUD, Depends()],
):
    """Update a chat title by its ID"""
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, raise_not_found=True)
    chat.title = request.data.title

    await chat_crud.save(chat)

    return JSONDataResponse(chat)


@chats.delete("/chats/{chat_id}", responses=responses(204, 401, 403, 404), status_code=204, response_class=Response)
async def delete_chat(
    chat_id: UUID, user_id: Annotated[str, Security(auth_user_id)], chat_crud: Annotated[ChatCRUD, Depends()]
):
    """Delete a chat by its ID"""
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, raise_not_found=True)

    await chat_crud.delete(chat)


@chats.get("/chats/{chat_id}/messages", responses=responses(401, 403, 404), response_model=DataResponse[list[Message]])
async def get_chat_messages(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    chat_crud: Annotated[ChatCRUD, Depends()],
):
    """Get all messages for a chat by its ID"""
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, include_messages=True, raise_not_found=True)

    return JSONDataResponse(chat.messages)


chats.include_router(converse)
chats.include_router(generate)
