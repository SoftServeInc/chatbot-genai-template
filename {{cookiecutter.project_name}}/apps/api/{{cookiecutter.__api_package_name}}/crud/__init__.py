"""Package for all services"""

from .chat_crud import ChatCRUD
from .message_crud import MessageCRUD
{%- if cookiecutter.enable_rag %}
from .rag_document_crud import RAGDocumentCRUD
{%- endif %}
from .terms_crud import TermsCRUD

__all__ = [
    "ChatCRUD",
    "MessageCRUD",
    "TermsCRUD",
    {%- if cookiecutter.enable_rag %}
    "RAGDocumentCRUD",
    {%- endif %}
]
