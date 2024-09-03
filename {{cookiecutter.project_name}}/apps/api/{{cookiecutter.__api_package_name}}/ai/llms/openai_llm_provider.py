"""Create an instance of LLM model for the language chain"""

from typing import ClassVar

from langchain.callbacks.base import Callbacks
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings
from pydantic.types import SecretStr

from ...app.settings import check_required_settings, settings
from .abstract_llm_provider import (
    LLM,
    LLM_MAX_TOKENS_DEFAULT,
    LLM_TEMPERATURE_DEFAULT,
    AbstractLLMProvider,
    LLMType,
)


class OpenAILLMProvider(AbstractLLMProvider):
    """The LLM provider for Azure OpenAI"""

    NAME: ClassVar[str] = "openai"

    def create_chat_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> AzureChatOpenAI:
        """Create an instance of chat LLM model deployed on Azure OpenAI"""
        self._check_settings(LLMType.CHAT)

        return AzureChatOpenAI(
            openai_api_key=SecretStr(settings.Azure.OpenAI.api_key),
            openai_api_version=settings.Azure.OpenAI.api_version,
            azure_endpoint=settings.Azure.OpenAI.endpoint,
            model_name=settings.Azure.OpenAI.chat_model,
            deployment_name=settings.Azure.OpenAI.chat_deployment,
            request_timeout=settings.Azure.OpenAI.request_timeout,
            temperature=temperature,
            streaming=streaming,
            callbacks=callbacks,
            max_tokens=max_tokens,
        )

    def create_text_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> AzureChatOpenAI:
        """Create an instance of text LLM model deployed on Azure OpenAI"""
        self._check_settings(LLMType.TEXT)

        # We don't use AzureOpenAI for text LLMs because GPT models don't support completion operation anymore - only Chat Completion is supported
        # https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-and-gpt-4-turbo-preview-models
        return AzureChatOpenAI(
            openai_api_key=SecretStr(settings.Azure.OpenAI.api_key),
            openai_api_version=settings.Azure.OpenAI.api_version,
            azure_endpoint=settings.Azure.OpenAI.endpoint,
            model_name=settings.Azure.OpenAI.text_model,
            deployment_name=settings.Azure.OpenAI.text_deployment,
            request_timeout=settings.Azure.OpenAI.request_timeout,
            temperature=temperature,
            streaming=streaming,
            callbacks=callbacks,
            max_tokens=max_tokens,
        )

    def create_embedding_llm(
        self,
    ) -> AzureOpenAIEmbeddings:
        """Create an instance of embedding LLM model deployed on Azure OpenAI"""
        self._check_settings(LLMType.EMBEDDING)

        return AzureOpenAIEmbeddings(
            openai_api_key=SecretStr(settings.Azure.OpenAI.api_key),
            openai_api_version=settings.Azure.OpenAI.api_version,
            azure_endpoint=settings.Azure.OpenAI.endpoint,
            deployment=settings.Azure.OpenAI.embedding_deployment,
            request_timeout=settings.Azure.OpenAI.request_timeout,
        )

    def get_max_input_tokens(self, llm: LLM) -> int:
        """Get the maximum number of input tokens for the given LLM model"""
        return self._assert_type(llm).max_tokens or LLM_MAX_TOKENS_DEFAULT

    def is_streaming_enabled(self, llm: LLM) -> bool:
        """Check if the given LLM model supports streaming"""
        return self._assert_type(llm).streaming

    @staticmethod
    def _assert_type(llm: LLM) -> AzureChatOpenAI:
        if not isinstance(llm, AzureChatOpenAI):
            raise TypeError(f"Expected AzureChatOpenAI, got {type(llm)}")

        return llm

    @staticmethod
    def _check_settings(llm_type: LLMType) -> None:
        """Check the settings for Azure OpenAI"""
        check_required_settings(
            ["api_key", "api_version", "endpoint", f"{llm_type}_deployment", f"{llm_type}_model"], "Azure.OpenAI"
        )
