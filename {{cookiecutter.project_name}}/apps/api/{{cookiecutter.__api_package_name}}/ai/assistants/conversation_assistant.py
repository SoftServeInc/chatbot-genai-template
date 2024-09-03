"""
This module contains the conversational assistant. It is a simple wrapper around the ConversationChain class.
"""

from typing import Any, AsyncIterable

from langchain.prompts import PromptTemplate

from ...models import Message, MessageRole
from ..llms import llm_provider
from .abstract_assistant import AbstractBasicAssistant
from .utils import compose_history, format_actor_prefix, get_number_of_tokens_left

STOP_SEQUENCE = "\n\n" + format_actor_prefix(MessageRole.USER)
PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["chat_history", "question"],
    template=(
        """The following is a friendly conversation between a user and an AI assistant. The AI assistant is talkative and provides lots of specific details from its context.
If the assistant does not know the answer to a question, it truthfully says it does not know.
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


class ConversationAssistant(AbstractBasicAssistant):
    """Simple conversational assistant that uses the ConversationChain class to generate responses"""

    def _get_prompt_template(self):
        """Get the prompt template to use"""
        return PROMPT_TEMPLATE

    def _get_stop_sequence(self):
        """Get the stop sequence to use"""
        return STOP_SEQUENCE

    def _create_inputs(self, question: str, previous_messages: list[Message]) -> dict[str, Any]:
        """Creates the inputs for the chain"""
        return {
            "question": question,
            "chat_history": self._compose_history(question, previous_messages),
        }

    def _compose_history(self, question: str, previous_messages: list[Message]) -> str:
        """Get the number of remaining tokens after the inputs are added to the prompt"""
        llm = self._get_llm()
        context_without_history = PROMPT_TEMPLATE.format(question=question, chat_history="")
        max_history_tokens = get_number_of_tokens_left(context_without_history, llm)

        return compose_history(llm, previous_messages, max_history_tokens)


class ConversationAssistantBuffered(ConversationAssistant):
    """Conversational assistant that uses a buffered LLM"""

    def _get_llm(self):
        return llm_buffered

    async def generate(self, question: str, previous_messages: list[Message]) -> str:
        """Generates a buffered response to the given message"""
        return await self._run_buffered(self._create_inputs(question, previous_messages))


class ConversationAssistantStreamed(ConversationAssistant):
    """Conversational assistant that uses a streamed LLM"""

    def _get_llm(self):
        return llm_streamed

    def generate(self, question: str, previous_messages: list[Message]) -> AsyncIterable[str]:
        """Generates a streamed response to the given message"""
        return self._run_streamed(self._create_inputs(question, previous_messages))
