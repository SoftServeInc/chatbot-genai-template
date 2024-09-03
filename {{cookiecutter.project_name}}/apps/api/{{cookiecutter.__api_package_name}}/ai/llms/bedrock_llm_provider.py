"""Create an instance of LLM model for the language chain"""

from typing import Any, ClassVar

from langchain.callbacks.base import Callbacks
from langchain_community.embeddings.bedrock import BedrockEmbeddings
from langchain_community.llms.bedrock import BedrockBase

from ...app.settings import check_required_settings, settings
from ...common.langchain.bedrock import Bedrock, ChatBedrock
from .abstract_llm_provider import (
    LLM,
    LLM_MAX_TOKENS_DEFAULT,
    LLM_TEMPERATURE_DEFAULT,
    AbstractLLMProvider,
    LLMType,
)


class BedrockLLMProvider(AbstractLLMProvider):
    """The LLM provider for AWS Bedrock"""

    NAME: ClassVar[str] = "bedrock"

    def create_chat_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> ChatBedrock:
        """Create an instance of chat LLM model deployed on AWS Bedrock"""
        self._check_settings(LLMType.CHAT)
        model_id = settings.AWS.Bedrock.chat_model_id

        return ChatBedrock(
            credentials_profile_name=settings.AWS.profile or None,
            region_name=settings.AWS.region or None,
            model_id=model_id,
            model_kwargs=self._get_model_kwargs(model_id, temperature, max_tokens, LLMType.CHAT),
            streaming=streaming,
            callbacks=callbacks,
        )

    def create_text_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> Bedrock:
        """Create an instance of text LLM model deployed on AWS Bedrock"""
        self._check_settings(LLMType.TEXT)
        model_id = settings.AWS.Bedrock.text_model_id

        if not streaming:
            # Because of https://github.com/langchain-ai/langchain/blob/4159a4723c0a6482a0e8e9e4dd161d5c24f69c88/libs/community/langchain_community/llms/bedrock.py#L880
            streaming = True

        return Bedrock(
            credentials_profile_name=settings.AWS.profile or None,
            region_name=settings.AWS.region or None,
            model_id=model_id,
            model_kwargs=self._get_model_kwargs(model_id, temperature, max_tokens, LLMType.TEXT),
            streaming=streaming,
            callbacks=callbacks,
        )

    def create_embedding_llm(
        self,
    ) -> BedrockEmbeddings:
        """Create an instance of embedding LLM model deployed on AWS Bedrock"""
        self._check_settings(LLMType.EMBEDDING)
        model_id = settings.AWS.Bedrock.embedding_model_id

        return BedrockEmbeddings(
            credentials_profile_name=settings.AWS.profile or None,
            region_name=settings.AWS.region or None,
            model_id=model_id,
        )

    def get_max_input_tokens(self, llm: LLM) -> int:
        """Get the maximum number of input tokens for the given LLM model"""
        bedrock = self._assert_type(llm)
        model_id = bedrock.model_id
        model_kwargs = bedrock.model_kwargs or {}

        match self._get_model_provider(model_id):
            case "anthropic":
                tokens = model_kwargs.get("max_tokens", None) or model_kwargs.get("max_tokens_to_sample", None)
            case "meta":
                tokens = model_kwargs.get("max_gen_len", None)
            case "amazon":
                tokens = model_kwargs.get("maxTokenCount", None)
            case "ai21":
                tokens = model_kwargs.get("maxTokens", None)
            case "cohere":
                tokens = model_kwargs.get("max_tokens", None)
            case _:
                return LLM_MAX_TOKENS_DEFAULT

        return int(tokens) if tokens else LLM_MAX_TOKENS_DEFAULT

    def is_streaming_enabled(self, llm: LLM) -> bool:
        """Check if the given LLM model supports streaming"""
        return self._assert_type(llm).streaming

    @staticmethod
    def _assert_type(llm: LLM) -> BedrockBase:
        if not isinstance(llm, BedrockBase):
            raise TypeError(f"Expected Bedrock model, got {type(llm)}")

        return llm

    @staticmethod
    def _check_settings(llm_type: LLMType) -> None:
        """Check the settings for AWS Bedrock"""
        check_required_settings([f"{llm_type}_model_id"], "AWS.Bedrock")

    @staticmethod
    def _get_model_provider(model_id: str):
        """Get the LLM model provider from the model ID"""
        return model_id.split(".")[0]

    @staticmethod
    def _get_model_kwargs(model_id: str, temperature: float, max_tokens: int, llm_type: LLMType) -> dict[str, Any]:
        model_provider = BedrockLLMProvider._get_model_provider(model_id)
        model_kwargs = {"temperature": temperature}

        # https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html
        # https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters.html
        match model_provider:
            case "anthropic":
                if llm_type == LLMType.CHAT:
                    model_kwargs["max_tokens"] = max_tokens
                else:
                    model_kwargs["max_tokens_to_sample"] = max_tokens
            case "meta":
                model_kwargs["max_gen_len"] = max_tokens
            case "amazon":
                model_kwargs["maxTokenCount"] = max_tokens
            case "ai21":
                model_kwargs["maxTokens"] = max_tokens
            case "cohere":
                model_kwargs["max_tokens"] = max_tokens
            case _:
                raise NotImplementedError(f"Model '{model_id}' is not supported for Chat conversation.")

        return model_kwargs
