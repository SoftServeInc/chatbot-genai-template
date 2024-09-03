"""API router for Chat related endpoints"""

from logging import getLogger
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Security

from ....app.exceptions import ForbiddenException
from ....app.schemas import DataRequest, DataResponse, JSONDataResponse, responses
from ....auth import auth_user_id
from ....crud import MessageCRUD
from ....models import Message, MessageRole
from .models import MessageFeedbackAccepted, ProvideMessageFeedback

logger = getLogger(__name__)

messages = APIRouter(tags=["messages"])


@messages.get("/messages/{message_id}", responses=responses(401, 403, 404), response_model=DataResponse[Message])
async def get_message(
    message_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    message_crud: Annotated[MessageCRUD, Depends()],
):
    """Get a single message by its ID"""
    message = await message_crud.get_by_id_for_user(message_id, user_id, raise_not_found=True)

    return JSONDataResponse(message)


@messages.post(
    "/messages/{message_id}/feedback",
    responses=responses(401, 403, 404),
    response_model=DataResponse[MessageFeedbackAccepted],
)
async def provide_message_feedback(
    message_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    request: DataRequest[ProvideMessageFeedback],
    message_crud: Annotated[MessageCRUD, Depends()],
):
    """Provide feedback for a specific message"""
    message = await message_crud.get_by_id_for_user(message_id, user_id, raise_not_found=True)

    if message.role != MessageRole.ASSISTANT:
        raise ForbiddenException("Only messages from the assistant can be rated")

    message.feedback_rating = request.data.rating
    message.feedback_comment = request.data.comment

    await message_crud.save(message)

    return JSONDataResponse(MessageFeedbackAccepted(rating=message.feedback_rating))
