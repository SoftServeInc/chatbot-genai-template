"""AI Assistants module"""

from .conversation_assistant import (
    ConversationAssistantBuffered,
    ConversationAssistantStreamed,
)

{%- if cookiecutter.enable_rag %}
from .conversation_retrieval_assistant import (
    ConversationRetrievalAssistantBuffered,
    ConversationRetrievalAssistantStreamed,
)
{%- endif %}
from .subject_line_assistant import SubjectLineAssistant

__all__ = [
    "ConversationAssistantBuffered",
    "ConversationAssistantStreamed",
    {%- if cookiecutter.enable_rag %}
    "ConversationRetrievalAssistantBuffered",
    "ConversationRetrievalAssistantStreamed",
    {%- endif %}
    "SubjectLineAssistant",
]
