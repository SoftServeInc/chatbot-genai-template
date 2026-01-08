"""The module that defines the virtual assistants"""

from .assistants import (
    ConversationAssistantBuffered,
    ConversationAssistantStreamed,
    {%- if cookiecutter.enable_rag %}
    ConversationRetrievalAssistantBuffered,
    ConversationRetrievalAssistantStreamed,
    {%- endif %}
    SubjectLineAssistant,
)
from .llms import llm_provider

__all__ = [
    "llm_provider",
    "ConversationAssistantBuffered",
    "ConversationAssistantStreamed",
    {%- if cookiecutter.enable_rag %}
    "ConversationRetrievalAssistantBuffered",
    "ConversationRetrievalAssistantStreamed",
    {%- endif %}
    "SubjectLineAssistant",
]
