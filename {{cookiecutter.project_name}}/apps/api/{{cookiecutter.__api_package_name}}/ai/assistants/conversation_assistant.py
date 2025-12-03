"""
Conversation assistant using LCEL (LangChain Expression Language).

This module implements a modern conversational assistant using LangChain's
Expression Language (LCEL) for composable, streaming-first chains.
"""

from typing import Any, AsyncIterable

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough

from ...models import Message, MessageRole
from ..llms import llm_provider
from .abstract_assistant import AbstractBasicAssistant
from .utils import compose_history, format_actor_prefix, get_number_of_tokens_left

STOP_SEQUENCE = "\n\n" + format_actor_prefix(MessageRole.USER)
PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["chat_history", "question"],
    template=(
        """The following is a friendly conversation between a user and an AI assistant. The AI assistant is talkative and provides lots of specific details from its context.
If the assistant does not know the answer to a question, it does not make up answer and says "I don't know".
The assistant should format its responses using newlines in a way that is easy to read.

Current conversation:
---------------------
{chat_history}
"""
        + format_actor_prefix(MessageRole.USER)
        + """{question}

"""
        + format_actor_prefix(MessageRole.ASSISTANT)
    ),
)

llm_streamed = llm_provider.create_chat_llm(streaming=True)
llm_buffered = llm_provider.create_chat_llm(streaming=False)

# System prompt for the conversation
SYSTEM_PROMPT = (
    "You are a helpful and friendly AI assistant. "
    "You are talkative and provide lots of specific details from your context. "
    "If you do not know the answer to a question, you say you do not know. "
    "Format your responses using newlines in a way that is easy to read."
)

# Create the chat prompt template using LCEL
CHAT_PROMPT = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ]
)


def _convert_messages_to_langchain(messages: list[Message]) -> list[HumanMessage | AIMessage]:
    """Convert application Message objects to LangChain message format"""
    langchain_messages: list[HumanMessage | AIMessage] = []

    # Sort by created_at to ensure correct order
    sorted_messages = sorted(messages, key=lambda m: m.created_at)

    for message in sorted_messages:
        content = message.content
        if message.role == MessageRole.USER:
            langchain_messages.append(HumanMessage(content=content))
        elif message.role == MessageRole.ASSISTANT:
            langchain_messages.append(AIMessage(content=content))

    return langchain_messages


class ConversationAssistantLCEL:
    """
    Base conversation assistant using LCEL (LangChain Expression Language).

    This uses the modern LangChain approach with:
    - ChatPromptTemplate for structured prompts
    - Pipe operator (|) for composing chains
    - Native streaming support
    """

    def __init__(self, streaming: bool = False):
        self.streaming = streaming
        self._llm = llm_provider.create_chat_llm(streaming=streaming)
        self._chain = self._build_chain()

    def _build_chain(self):
        """Build the LCEL chain"""
        return (
            RunnablePassthrough.assign(chat_history=lambda x: x.get("chat_history", []))
            | CHAT_PROMPT
            | self._llm
            | StrOutputParser()
        )

    def _prepare_inputs(self, question: str, previous_messages: list[Message]) -> dict[str, Any]:
        """Prepare inputs for the chain"""
        return {
            "question": question,
            "chat_history": _convert_messages_to_langchain(previous_messages),
        }


class ConversationAssistantBuffered(ConversationAssistantLCEL):
    """
    Conversation assistant that returns buffered (complete) responses.

    Uses LCEL's ainvoke() for async execution.
    """

    def __init__(self):
        super().__init__(streaming=False)

    async def generate(self, question: str, previous_messages: list[Message]) -> str:
        """Generate a complete response to the given question"""
        inputs = self._prepare_inputs(question, previous_messages)
        response = await self._chain.ainvoke(inputs)
        return response.strip()


class ConversationAssistantStreamed(ConversationAssistantLCEL):
    """
    Conversation assistant that streams responses token by token.

    Uses LCEL's astream() for async streaming.
    """

    def __init__(self):
        super().__init__(streaming=True)

    async def generate(self, question: str, previous_messages: list[Message]) -> AsyncIterable[str]:
        """Generate a streamed response to the given question"""
        inputs = self._prepare_inputs(question, previous_messages)
        first_chunk = True

        async for chunk in self._chain.astream(inputs):
            if first_chunk:
                # Strip leading whitespace from first chunk
                chunk = chunk.lstrip()
                first_chunk = False
            yield chunk
