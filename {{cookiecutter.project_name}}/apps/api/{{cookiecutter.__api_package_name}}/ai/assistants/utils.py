"""Utility functions for the AI business logic"""

from typing import Sequence

from langchain.schema import BaseMessage

from ...common.datetime import epoch
from ...models import Message, MessageRole
from ..llms import LLM, LLMType, llm_provider

MESSAGE_ROLE_TO_CONVERSATION_ACTOR = {
    MessageRole.ASSISTANT: "ASSISTANT",
    MessageRole.USER: "USER",
}

MessageLike = Message | BaseMessage | tuple[str, str]


def format_actor_prefix(role: MessageRole) -> str:
    """Format a prefix with the given role"""
    return MESSAGE_ROLE_TO_CONVERSATION_ACTOR[role] + ": "


def format_actor_message(message: MessageLike) -> str:
    """Format a message with the given role"""
    if isinstance(message, Message):
        role = message.role
        content = message.content
    else:
        if isinstance(message, BaseMessage):
            msgtype = message.type
            content = str(message.content)
        elif isinstance(message, tuple):
            msgtype = message[0]
            content = message[1]

        if msgtype == "ai":
            role = MessageRole.ASSISTANT
        elif msgtype == "human":
            role = MessageRole.USER
        else:
            return ""

    return format_actor_prefix(role) + content


def compose_history(llm: LLM, messages: Sequence[MessageLike], max_tokens: int = 0) -> str:
    """Compose the history of the conversation"""
    if not messages:
        return ""

    formatted_messages = []
    message_separator = "\n\n"
    current_tokens = 50  # save some extra tokens just in case the tokenizer is not accurate enough

    if messages and isinstance(messages[0], Message):
        messages = list(messages)
        messages.sort(key=lambda m: m.created_at.timestamp() if isinstance(m, Message) else epoch(), reverse=True)

    for message in messages:
        formatted = format_actor_message(message)

        if not formatted:
            continue

        if max_tokens > 0:
            current_tokens += llm.get_num_tokens(formatted + message_separator)
            if current_tokens > max_tokens:
                break

        formatted_messages.append(formatted)

    if not formatted_messages:
        return ""

    return "\n" + (message_separator.join(reversed(formatted_messages))) + "\n"


def get_number_of_tokens_left(context: str, llm: LLM, llm_type: LLMType = LLMType.CHAT) -> int:
    """Get the number of remaining tokens given the context"""
    return llm_provider.get_max_output_tokens(llm, llm_type) - llm.get_num_tokens(context)
