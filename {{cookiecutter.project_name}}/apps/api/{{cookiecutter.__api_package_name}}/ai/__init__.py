"""The module that defines the virtual assistants"""

from .assistants.conversation_assistant import (
    ConversationAssistantBuffered,
    ConversationAssistantStreamed,
)
from .assistants.conversation_retrieval_assistant import (
    ConversationRetrievalAssistantBuffered,
    ConversationRetrievalAssistantStreamed,
)
from .assistants.subject_line_assistant import SubjectLineAssistant
from .llms import llm_provider

__all__ = [
    "llm_provider",
    "ConversationAssistantBuffered",
    "ConversationAssistantStreamed",
    "ConversationRetrievalAssistantBuffered",
    "ConversationRetrievalAssistantStreamed",
    "SubjectLineAssistant",
]
