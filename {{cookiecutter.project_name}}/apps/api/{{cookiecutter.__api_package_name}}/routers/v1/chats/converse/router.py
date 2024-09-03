"""API router for Chat related endpoints"""

from asyncio import CancelledError
from logging import getLogger
from typing import Annotated, AsyncGenerator
from uuid import UUID

from fastapi import APIRouter, Depends, Security
from fastapi.responses import StreamingResponse
from starlette.background import BackgroundTask

from .....ai import (
    ConversationAssistantBuffered,
    ConversationAssistantStreamed,
    llm_provider,
)
from .....app.exceptions import NotImplementedException
from .....app.schemas import DataRequest, JSONDataResponse, responses
from .....auth import auth_user_id
from .....common.sse import SSE_CONTENT_TYPE, sse_event
from .....crud import ChatCRUD, MessageCRUD
from .....models import Message, MessageRole, MessageSegment, MessageSegmentType
from .models import ConverseChat, ConverseUserMessage

logger = getLogger(__name__)

converse = APIRouter()


@converse.post(
    "/chats/{chat_id}/converse",
    responses=(
        responses(401, 403, 404, 422)
        | {
            200: {
                "description": "Chat conversation messages data",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "array",
                                    "prefixItems": [ConverseUserMessage.schema(), Message.schema()],
                                    "minItems": 2,
                                    "maxItems": 2,
                                    "additionalItems": False,
                                    "examples": [
                                        [
                                            {
                                                "id": "f724ce60-d8d1-4df8-80ac-8d88de4f61fa",
                                                "created_at": "2023-11-27T23:44:57.806136+00:00",
                                                "modified_at": "2023-11-27T23:44:58.620737+00:00",
                                                "chat_id": "50212423-3658-46c9-a346-ba520a0bf8db",
                                                "role": MessageRole.USER,
                                                "in_progress": False,
                                            },
                                            {
                                                "id": "3c95858b-7405-441c-a21a-927978250ef1",
                                                "created_at": "2023-11-27T23:44:57.806299+00:00",
                                                "modified_at": "2023-11-27T23:44:58.620860+00:00",
                                                "chat_id": "50212423-3658-46c9-a346-ba520a0bf8db",
                                                "role": MessageRole.ASSISTANT,
                                                "segments": [MessageSegment.text("Believe in yourself")],
                                                "in_progress": False,
                                                "feedback_rating": 0,
                                            },
                                        ]
                                    ],
                                }
                            },
                        }
                    }
                },
            }
        }
    ),
)
async def chat_converse_buffered(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    request: DataRequest[ConverseChat],
    chat_crud: Annotated[ChatCRUD, Depends()],
    message_crud: Annotated[MessageCRUD, Depends()],
    assistant: Annotated[ConversationAssistantBuffered, Depends()],
):
    """Converse with the assistant in a chat returing the buffered response - i.e., the complete response is returned at once."""
    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, include_messages=True, raise_not_found=True)

    user_message_content = request.data.text
    user_message_segment = MessageSegment(MessageSegmentType.TEXT, user_message_content)
    user_message = Message(chat_id=chat.id, role=MessageRole.USER, segments=[user_message_segment])

    assistant_message_content = await assistant.generate(user_message_content, chat.messages)
    assistant_message_segment = MessageSegment(MessageSegmentType.TEXT, assistant_message_content)
    assistant_message = Message(chat_id=chat.id, role=MessageRole.ASSISTANT, segments=[assistant_message_segment])

    await message_crud.save_all(user_message, assistant_message, modified=False)

    return JSONDataResponse([ConverseUserMessage(user_message), assistant_message])


@converse.post(
    "/chats/{chat_id}/converse-stream",
    response_class=StreamingResponse,
    responses=(
        responses(401, 403, 404, 422)
        | {
            200: {
                "description": "Chat conversation messages data stream",
                "content": {
                    "text/event-stream": {
                        "example": """
event: message
data: {"id":"f724ce60-d8d1-4df8-80ac-8d88de4f61fa","created_at":"2023-11-27T23:44:57.806136+00:00","modified_at":"2023-11-27T23:44:58.620737+00:00","chat_id":"50212423-3658-46c9-a346-ba520a0bf8db","role":"user","in_progress":true}

event: message
data: {"id":"3c95858b-7405-441c-a21a-927978250ef1","created_at":"2023-11-27T23:44:57.806299+00:00","modified_at":"2023-11-27T23:44:58.620860+00:00","chat_id":"50212423-3658-46c9-a346-ba520a0bf8db","role":"assistant","segments":[],"in_progress":true,"feedback_rating":0}

event: segment
data: {"message_id":"3c95858b-7405-441c-a21a-927978250ef1","segment":{"type":"text","content":"Bel"}}

event: segment
data: {"message_id":"3c95858b-7405-441c-a21a-927978250ef1","segment":{"type":"text","content":"ieve"}}

event: segment
data: {"message_id":"3c95858b-7405-441c-a21a-927978250ef1","segment":{"type":"text","content":" in"}}

event: segment
data: {"message_id":"3c95858b-7405-441c-a21a-927978250ef1","segment":{"type":"text","content":" yourself"}}
""".strip(),
                    },
                },
            },
        }
    ),
)
async def chat_converse_stream(
    chat_id: UUID,
    user_id: Annotated[str, Security(auth_user_id)],
    request: DataRequest[ConverseChat],
    chat_crud: Annotated[ChatCRUD, Depends()],
    message_crud: Annotated[MessageCRUD, Depends()],
    assistant: Annotated[ConversationAssistantStreamed, Depends()],
):
    """Converse with the assistant in a chat returing the streamed response - i.e., the response is streamed as it is generated."""

    # Streaming is not supported yet for GCP VertexAI: https://github.com/langchain-ai/langchain/pull/13650
    if llm_provider.NAME == "vertexai":
        raise NotImplementedException("Streaming is not supported yet for GCP VertexAI")

    chat = await chat_crud.get_by_id_for_user(chat_id, user_id, include_messages=True, raise_not_found=True)

    user_message_content = request.data.text
    user_message_segment = MessageSegment(MessageSegmentType.TEXT, user_message_content)
    user_message = Message(chat_id=chat.id, role=MessageRole.USER, in_progress=True, segments=[user_message_segment])

    assistant_message = Message(chat_id=chat.id, role=MessageRole.ASSISTANT, in_progress=True, segments=[])

    stream_handler = _StreamHandler(message_crud, user_message, assistant_message)

    async def stream() -> AsyncGenerator[str, None]:
        try:
            async for text in assistant.generate(user_message_content, chat.messages):
                async for event in stream_handler.handle(text):
                    yield event
        except BaseException as e:  # pylint: disable=broad-exception-caught
            if not isinstance(e, CancelledError):
                raise

    stream_generator = stream()

    async def post_process() -> None:
        await stream_generator.aclose()  # make sure the stream is closed
        await stream_handler.finalize()

    return StreamingResponse(
        stream_generator,
        media_type=SSE_CONTENT_TYPE,
        background=BackgroundTask(post_process),
    )


class _StreamHandler:
    """Stream handler for handling streamed assistant responses"""

    message_crud: MessageCRUD
    message_saved: bool

    user_message: Message
    assistant_message: Message
    assistant_message_content: str
    assistant_message_id: str

    def __init__(self, message_crud: MessageCRUD, user_message: Message, assistant_message: Message) -> None:
        self.message_crud = message_crud
        self.message_saved = False

        self.user_message = user_message
        self.assistant_message = assistant_message
        self.assistant_message_id = str(self.assistant_message.id)
        self.assistant_message_content = ""

    async def handle(self, chunk: str) -> AsyncGenerator[str, None]:
        """
        Handle a response chunk from the assistant and yield the SSE events for the response.
        When the first chunk is received, save the user message and the assistant message to the database.
        """
        if not self.message_saved:
            await self.message_crud.save_all(self.user_message, self.assistant_message, modified=False)
            self.message_saved = True
            user_message = ConverseUserMessage(self.user_message)
            yield sse_event(user_message, "message") + sse_event(self.assistant_message, "message")

        self.assistant_message_content += chunk
        yield sse_event({"message_id": self.assistant_message_id, "segment": MessageSegment.text(chunk)}, "segment")

    async def finalize(self) -> None:
        """
        Finalize the process of handling streamed chunks
        via marking the messages as not in progress and save them to the database.

        However, if the messages were not saved yet, then it means no response was generated by the assistant,
        so we don't want to save the messages.
        """
        if not self.message_saved:
            return

        self.user_message.in_progress = False
        self.assistant_message.in_progress = False
        self.assistant_message.segments = [MessageSegment.text(self.assistant_message_content)]

        await self.message_crud.save_all(self.user_message, self.assistant_message)
