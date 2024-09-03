"""Create an instance of LLM model for the language chain"""

from os import environ, path
from typing import ClassVar

from langchain.callbacks.base import Callbacks
from langchain_google_vertexai import ChatVertexAI, VertexAI
from langchain_google_vertexai.embeddings import VertexAIEmbeddings
from langchain_google_vertexai.llms import _VertexAICommon as VertexAICommon

from ...app.settings import check_required_settings, settings
from .abstract_llm_provider import (
    LLM,
    LLM_MAX_TOKENS_DEFAULT,
    LLM_TEMPERATURE_DEFAULT,
    AbstractLLMProvider,
    LLMType,
)


class VertexAILLMProvider(AbstractLLMProvider):
    """The LLM provider for GCP VertexAI"""

    NAME: ClassVar[str] = "vertexai"

    def __init__(self) -> None:
        super().__init__()

        # https://stackoverflow.com/questions/60071081/grpc-ver-1-22-0-dns-resolution-failed
        environ["GRPC_DNS_RESOLVER"] = "native"

    def does_chat_llm_support_system_message(self) -> bool:
        return not settings.GCP.VertexAI.chat_model_name.startswith("gemini")

    def create_chat_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> ChatVertexAI:
        """Create an instance of LLM model deployed on GCP VertexAI"""
        self._check_settings(LLMType.CHAT)

        return ChatVertexAI(
            credentials=self._get_credentials(),
            project=settings.GCP.project,
            location=settings.GCP.location,
            model_name=settings.GCP.VertexAI.chat_model_name,
            max_output_tokens=max_tokens,
            temperature=temperature,
            streaming=streaming,
            callbacks=callbacks,
        )

    def create_text_llm(
        self,
        max_tokens: int = LLM_MAX_TOKENS_DEFAULT,
        temperature: float = LLM_TEMPERATURE_DEFAULT,
        streaming: bool = False,
        callbacks: Callbacks = None,
    ) -> VertexAI:
        """Create an instance of LLM model deployed on GCP VertexAI"""
        self._check_settings(LLMType.TEXT)

        return VertexAI(
            credentials=self._get_credentials(),
            project=settings.GCP.project,
            location=settings.GCP.location,
            model_name=settings.GCP.VertexAI.text_model_name,
            max_output_tokens=max_tokens,
            temperature=temperature,
            streaming=streaming,
            callbacks=callbacks,
        )

    def create_embedding_llm(
        self,
    ) -> VertexAIEmbeddings:
        """Create an instance of embedding LLM model deployed on GCP VertexAI"""
        self._check_settings(LLMType.EMBEDDING)

        return VertexAIEmbeddings(
            credentials=self._get_credentials(),
            project=settings.GCP.project,
            location=settings.GCP.location,
            model_name=settings.GCP.VertexAI.embedding_model_name,
        )

    def get_max_input_tokens(self, llm: LLM) -> int:
        """Get the maximum number of input tokens for the given LLM model"""
        return self._assert_type(llm).max_output_tokens or LLM_MAX_TOKENS_DEFAULT

    def is_streaming_enabled(self, llm: LLM) -> bool:
        """Check if the given LLM model supports streaming"""
        return self._assert_type(llm).streaming

    @staticmethod
    def _assert_type(llm: LLM) -> VertexAICommon:
        if not isinstance(llm, VertexAICommon):
            raise TypeError(f"Expected ChatVertexAI, got {type(llm)}")

        return llm

    @staticmethod
    def _get_credentials():
        """Get the credentials for VertexAI"""
        key_path = settings.GCP.service_account_key_path

        if not key_path:
            return None

        if not path.exists(key_path):
            raise FileNotFoundError(f"Specified service account key file not found at '{key_path}'")

        from google.oauth2.service_account import Credentials  # type: ignore

        return Credentials.from_service_account_file(
            key_path, scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )

    @staticmethod
    def _check_settings(llm_type: LLMType) -> None:
        """Check the settings for VertexAI"""
        check_required_settings(["project", "location"], "GCP")
        check_required_settings([f"{llm_type}_model_name"], "GCP.VertexAI")
