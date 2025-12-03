"""Document related models for RAG functionality"""

from typing import Any, ClassVar, Optional

import numpy as np
from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB as SQL_JSONB
from sqlmodel import Field as SQLField

from ..app.settings import settings
from .generic import GenericResource, TableName

# Type alias for metadata dict
_MetadataDict = dict[str, Any]


class AsyncpgVector(Vector):  # pylint: disable=abstract-method
    """Custom Vector type that works with asyncpg by passing numpy arrays directly"""

    cache_ok = True

    def bind_processor(self, dialect):
        """Override to pass numpy array directly to asyncpg instead of string"""

        def process(value):
            if value is None:
                return None
            if isinstance(value, np.ndarray):
                return value
            return np.array(value, dtype=np.float32)

        return process

    def result_processor(self, dialect, coltype):
        """Convert result back to numpy array"""

        def process(value):
            if value is None:
                return None
            return np.array(value, dtype=np.float32)

        return process


class RAGDocumentBase(GenericResource):
    """The base model representing a document for RAG"""

    title: str = SQLField(max_length=255)
    filename: str = SQLField(max_length=255)
    content_type: str = SQLField(max_length=100)  # MIME type
    content: str = SQLField(default="")  # Extracted text content
    doc_metadata: Optional[_MetadataDict] = SQLField(
        default=None,
        sa_type=SQL_JSONB,
        sa_column_kwargs={"name": "doc_metadata"},
    )


class RAGDocument(RAGDocumentBase, table=True):
    """The database persisted model representing a document with vector embedding"""

    __tablename__: ClassVar[TableName] = "rag_documents"

    # Vector embedding column - dimensions configurable via RAG_EMBEDDING_DIMENSIONS
    # Using custom AsyncpgVector type for proper asyncpg integration
    embedding: Optional[list[float]] = SQLField(
        default=None,
        sa_column=Column(AsyncpgVector(settings.RAG.embedding_dimensions), nullable=True),
    )
