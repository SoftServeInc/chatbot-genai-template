"""
This module contains the conversational assistant. It is a simple wrapper around the ConversationChain class.
"""

from typing import Any

from langchain.prompts import PromptTemplate

from ...models import Message
from ..llms import llm_provider
from .abstract_assistant import AbstractBasicAssistant
from .utils import compose_history

MAX_HISTORY_TOKENS = 1200  # analyze at most 1200 latest tokens of the history to generate a subject line
MAX_SUBJECT_LENGTH = 50  # in characters

STOP_SEQUENCE = "\n"
PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["chat_history", "input"],
    template=(
        """The following is a friendly conversation between a user and an AI assistant - their conversation history is delimited by "=====" symbols.
Then there is a subject line that summarizes the conversation.

- The subject line is in English.
- The subject line is a single line of text.
- The subject line contains not more than """
        + str(MAX_SUBJECT_LENGTH)
        + """ characters in total.
- The subject line is not wrapped in quotation marks.
- The subject line does not contain any newline characters.
- There is a newline character after the subject line that indicates the end of the subject line.

Conversation history:
=====
{chat_history}
=====

Subject line: """
    ),
)

# Although usually 1 token is roughly 4 characters, we use 2.5x instead of 4x to be safe
llm = llm_provider.create_text_llm(max_tokens=int(MAX_SUBJECT_LENGTH / 2.5))


class SubjectLineAssistant(AbstractBasicAssistant):
    """Simple assistant that generates a subject line for a conversation"""

    def _get_llm(self):
        """Get the LLM to use"""
        return llm

    def _get_prompt_template(self):
        """Get the prompt template to use"""
        return PROMPT_TEMPLATE

    def _get_stop_sequence(self):
        """Get the stop sequence to use"""
        return STOP_SEQUENCE

    def _create_inputs(self, messages: list[Message]) -> dict[str, Any]:
        """Creates the inputs for the chain"""
        return {
            "chat_history": compose_history(self._get_llm(), messages, MAX_HISTORY_TOKENS),
        }

    async def generate(self, messages: list[Message]) -> str:
        """Generates a subject line for the given conversation"""
        subject = await self._run_buffered(self._create_inputs(messages))

        if subject.startswith('"') and subject.endswith('"'):
            subject = subject[1:-1]

        if subject[-1] in [".", "?", "!"]:
            subject = subject[:-1]

        return subject
