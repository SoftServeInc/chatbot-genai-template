"""DTO models for the RAG Document API endpoints"""

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class RAGDocumentResponse(BaseModel):
    """DTO response model for RAG document endpoints (excludes embedding vector)"""

    id: UUID
    created_at: datetime
    modified_at: datetime
    title: str
    filename: str
    content_type: str
    content: str
    doc_metadata: Optional[dict[str, Any]] = Field(default=None)
    has_embedding: bool = False

    @classmethod
    def from_document(cls, document: Any) -> "RAGDocumentResponse":
        """Create response from RAGDocument"""
        return cls(
            id=document.id,
            created_at=document.created_at,
            modified_at=document.modified_at,
            title=document.title,
            filename=document.filename,
            content_type=document.content_type,
            content=document.content,
            doc_metadata=document.doc_metadata,
            has_embedding=document.embedding is not None,
        )


class CreateRAGDocumentRequest(BaseModel):
    """DTO request model for POST /rag/documents endpoint (manual text input)"""

    title: str = Field(..., max_length=255)
    content: str = Field(..., description="Text content of the document")
    doc_metadata: Optional[dict[str, Any]] = Field(default=None)


class UpdateRAGDocumentRequest(BaseModel):
    """DTO request model for PATCH /rag/documents/{id} endpoint"""

    title: Optional[str] = Field(default=None, max_length=255)
    content: Optional[str] = Field(default=None, description="Updated text content")
    doc_metadata: Optional[dict[str, Any]] = Field(default=None)


class SearchRAGDocumentsRequest(BaseModel):
    """DTO request model for POST /rag/documents/search endpoint"""

    query: str = Field(..., description="Search query text")
    limit: int = Field(default=5, ge=1, le=50, description="Maximum results to return")
    threshold: float = Field(default=0.7, ge=0.0, le=1.0, description="Minimum similarity score")


class RAGSearchResultItem(BaseModel):
    """Single search result with similarity score"""

    document: RAGDocumentResponse
    similarity: float = Field(..., ge=0.0, le=1.0, description="Similarity score (0-1)")


class SearchRAGDocumentsResponse(BaseModel):
    """DTO response model for POST /rag/documents/search endpoint"""

    results: list[RAGSearchResultItem]
    query: str
