"""Create an instance of LLM model for the language chain"""

from abc import ABC, abstractmethod
from enum import StrEnum
from typing import Any, ClassVar

from langchain.base_language import BaseLanguageModel
from langchain.callbacks.base import Callbacks
from langchain.chat_models.base import BaseChatModel
from langchain.embeddings.base import Embeddings
from langchain.schema.language_model import get_tokenizer

from ...app.settings import settings

LLM = BaseLanguageModel[Any]

LLM_MAX_TOKENS_DEFAULT = 512
LLM_TEMPERATURE_DEFAULT = 0.7


class LLMType(StrEnum):
    """The type of the LLM model"""

    CHAT = "chat"
    TEXT = "text"
    EMBEDDING = "embedding"


class AbstractLLMProvider(ABC):
    """Abstract class for LLM provider"""

    NAME: ClassVar[str]

    def __init__(self) -> None:
        if settings.App.env != "local":
            # Initialize the tokenizer, that is used by LLMs to count the number of tokens
            # However we don't want to do it for the local development, because it slows down the startup and hence the reload
            # In this case the tokenizer will be initialized lazily, when the tokens are counted for the first time
            get_tokenizer()

    def does_chat_llm_support_system_message(self) -> bool:
        """Check if the chat LLM supports system message"""
        return True

    @abstractmethod
    def create_chat_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> BaseChatModel:
        """Create an instance of chat LLM model"""

    @abstractmethod
    def create_text_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> LLM:
        """Create an instance of text LLM model"""

    @abstractmethod
    def create_embedding_llm(
        self,
    ) -> Embeddings:
        """Create an instance of embedding LLM model"""

    @abstractmethod
    def is_streaming_enabled(self, llm: LLM) -> bool:
        """Check if the given LLM model supports streaming"""

    @abstractmethod
    def get_max_input_tokens(self, llm: LLM) -> int:
        """Get the maximum number of input tokens for the given LLM model"""

    def get_max_output_tokens(self, llm: LLM, llm_type: LLMType) -> int:
        """Get the maximum number of output tokens for the given LLM model"""
        return (
            settings.LLM.chat_max_tokens if llm_type == LLMType.CHAT else settings.LLM.text_max_tokens
        ) - self.get_max_input_tokens(llm)
