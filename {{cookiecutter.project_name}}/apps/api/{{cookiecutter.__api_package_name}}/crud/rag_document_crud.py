"""The module that contains the document CRUD service for RAG functionality"""

from typing import Optional

import numpy as np
from pgvector.asyncpg import register_vector
from sqlmodel import select

from ..models.rag_document import RAGDocument
from .abstract_crud import AbstractCRUD, AsyncSession, Query


class RAGDocumentCRUD(AbstractCRUD[RAGDocument]):
    """
    Service for RAG document CRUD operations.

    Extends AbstractCRUD with RAG-specific methods for document management
    and vector similarity search.

    Attributes:
        session: AsyncSession for database operations (inherited from AbstractCRUD)
    """

    def __init__(self, session: AsyncSession):
        """
        Initialize the RAG document CRUD service.

        Args:
            session: SQLAlchemy async session for database operations.
        """
        super().__init__(RAGDocument, session)

    async def get_by_filename(self, filename: str) -> Optional[RAGDocument]:
        """
        Get a document by its filename.

        Searches for a non-deleted document matching the exact filename.

        Args:
            filename: The exact filename to search for.

        Returns:
            The matching RAGDocument if found, None otherwise.
        """
        # Build query with deleted_at filter and filename filter
        query = (
            select(RAGDocument)
            # pylint: disable-next=no-member
            .where(RAGDocument.deleted_at.is_(None)).where(RAGDocument.filename == filename)  # type: ignore[union-attr]
        )

        result = await self.session.exec(query)
        return result.first()

    async def search_by_embedding(
        self,
        embedding: list[float],
        limit: int = 5,
        threshold: float = 0.7,
    ) -> list[tuple[RAGDocument, float]]:
        """
        Search documents by vector similarity using cosine distance.

        Args:
            embedding: The query embedding vector
            limit: Maximum number of results to return
            threshold: Minimum similarity score (0-1, higher is more similar)

        Returns:
            List of tuples containing (document, similarity_score)
        """
        # Convert embedding to numpy array for pgvector
        embedding_array = np.array(embedding, dtype=np.float32)

        # Get SQLAlchemy async connection and access the raw asyncpg connection
        conn = await self.session.connection()
        raw_conn = await conn.get_raw_connection()
        asyncpg_conn = raw_conn.driver_connection

        # Register vector type with this connection (idempotent)
        await register_vector(asyncpg_conn)

        # Use raw asyncpg with $N parameter syntax for pgvector compatibility
        # Using pgvector's cosine distance operator (<=>)
        # Convert to similarity score: 1 - distance
        sql = """
            SELECT
                d.*,
                1 - (d.embedding <=> $1) as similarity
            FROM rag_documents d
            WHERE d.deleted_at IS NULL
                AND d.embedding IS NOT NULL
                AND 1 - (d.embedding <=> $1) >= $2
            ORDER BY d.embedding <=> $1
            LIMIT $3
        """
        rows = await asyncpg_conn.fetch(sql, embedding_array, float(threshold), int(limit))

        documents_with_scores: list[tuple[RAGDocument, float]] = []

        for row in rows:
            # asyncpg returns asyncpg.Record objects with dict-like access
            doc_data = dict(row)
            similarity = doc_data.pop("similarity")
            doc = RAGDocument.model_validate(doc_data)
            documents_with_scores.append((doc, similarity))

        return documents_with_scores

    async def get_documents_without_embedding(self, limit: int = 100) -> list[RAGDocument]:
        """
        Get documents that don't have embeddings yet.

        Useful for batch processing to generate embeddings for documents
        that were created without them or need re-embedding.

        Args:
            limit: Maximum number of documents to return. Defaults to 100.

        Returns:
            List of RAGDocument instances with NULL embedding field.
        """

        def adjust_query(query: Query[RAGDocument]) -> Query[RAGDocument]:
            # pylint: disable-next=no-member
            return query.where(RAGDocument.embedding.is_(None))  # type: ignore

        return await self.get_all(adjust_query, limit=limit)
