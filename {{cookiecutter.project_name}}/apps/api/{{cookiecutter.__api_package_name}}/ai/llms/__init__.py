"""Create an instance of LLM model for the language chain"""

from ...app.settings import settings
from .abstract_llm_provider import LLM, AbstractLLMProvider, LLMType
from .bedrock_llm_provider import BedrockLLMProvider
from .openai_llm_provider import OpenAILLMProvider
from .vertexai_llm_provider import VertexAILLMProvider

__all__ = ["AbstractLLMProvider", "LLMType", "LLM", "get_llm_provider", "llm_provider"]


def get_llm_provider(provider: str) -> AbstractLLMProvider:
    """Get the LLM provider by name"""
    match provider.lower():
        case OpenAILLMProvider.NAME:
            return OpenAILLMProvider()
        case VertexAILLMProvider.NAME:
            return VertexAILLMProvider()
        case BedrockLLMProvider.NAME:
            return BedrockLLMProvider()
        case _:
            raise NotImplementedError(f"LLM provider '{provider}' is not supported")


llm_provider = get_llm_provider(settings.LLM.provider)
