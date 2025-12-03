"""Application models"""

from .chat import Chat, ChatBase
from .message import (
    Message,
    MessageBase,
    MessageRole,
    MessageSegment,
    MessageSegmentType,
)
{%- if cookiecutter.enable_rag %}
from .rag_document import RAGDocument
{%- endif %}
from .terms import TermsVersion, TermsVersionAgreement, TermsVersionBase
from .user import User

__all__ = [
    "MessageBase",
    "Message",
    "MessageRole",
    "MessageSegment",
    "MessageSegmentType",
    "ChatBase",
    "Chat",
    {%- if cookiecutter.enable_rag %}
    "RAGDocument",
    {%- endif %}
    "User",
    "TermsVersionBase",
    "TermsVersion",
    "TermsVersionAgreement",
]
