"""
Subject line assistant for generating chat titles using LCEL (LangChain Expression Language).
"""

from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

from ...models import Message
from ..llms import llm_provider
from .utils import compose_history

MAX_HISTORY_TOKENS = 1200  # analyze at most 1200 latest tokens of the history to generate a subject line
MAX_SUBJECT_LENGTH = 50  # in characters

STOP_SEQUENCE = "\n"
PROMPT_TEMPLATE = """The following is a friendly conversation between a user and an AI assistant - their conversation
history is delimited by "=====" symbols.
Then there is a subject line that summarizes the conversation.

- The subject line is in English.
- The subject line is a single line of text.
- The subject line contains not more than {max_length} characters in total.
- The subject line is not wrapped in quotation marks.
- The subject line does not contain any newline characters.
- There is a newline character after the subject line that indicates the end of the subject line.

Conversation history:
=====
{chat_history}
=====

Subject line: """


class SubjectLineAssistant:
    """
    Simple assistant that generates a subject line for a conversation using LCEL.

    Uses a text LLM to generate short, descriptive titles from chat history.
    """

    def __init__(self):
        """Initialize the subject line assistant"""
        # Create a text LLM with limited output tokens for subject line generation
        # 1 token ≈ 2.5 characters, so for 50 chars we need ~20 tokens
        self._llm = llm_provider.create_text_llm(max_tokens=int(MAX_SUBJECT_LENGTH / 2.5))
        self._chain = self._build_chain()

    def _build_chain(self):
        """Build the LCEL chain for subject line generation"""
        prompt = PromptTemplate(
            input_variables=["chat_history"],
            template=PROMPT_TEMPLATE,
            partial_variables={"max_length": str(MAX_SUBJECT_LENGTH)},
        )

        return prompt | self._llm.bind(stop=[STOP_SEQUENCE]) | StrOutputParser()

    def _prepare_inputs(self, messages: list[Message]) -> dict[str, Any]:
        """Prepare inputs for the chain"""
        return {
            "chat_history": compose_history(self._llm, messages, MAX_HISTORY_TOKENS),
        }

    async def generate(self, messages: list[Message]) -> str:
        """Generate a subject line for the given conversation"""
        inputs = self._prepare_inputs(messages)
        subject = await self._chain.ainvoke(inputs)
        subject = subject.strip()

        # Clean up the subject line
        if subject.startswith('"') and subject.endswith('"'):
            subject = subject[1:-1]

        if subject and subject[-1] in [".", "?", "!"]:
            subject = subject[:-1]

        return subject
