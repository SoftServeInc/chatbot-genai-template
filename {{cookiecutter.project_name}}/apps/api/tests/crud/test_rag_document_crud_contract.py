"""
Contract tests for the RAG Document CRUD interface.

These tests define the behavioral contract that RAGDocumentCRUD provides:

1. get_by_filename() - Retrieve document by filename
2. search_by_embedding() - Search documents by vector similarity
3. get_documents_without_embedding() - Get documents missing embeddings

Tests focus on WHAT the CRUD layer does, not HOW queries are built.
"""

from uuid import uuid4

import numpy as np
import pytest

from {{ cookiecutter.__api_package_name }}.crud.rag_document_crud import RAGDocumentCRUD
from {{ cookiecutter.__api_package_name }}.models.rag_document import RAGDocument


class TestRAGDocumentCRUDContract:
    """
    Contract tests for RAG Document CRUD operations.

    These tests verify the public interface behavior using local PostgreSQL.
    Each test uses unique IDs to avoid conflicts with existing data.
    """

    @pytest.fixture
    def crud(self, db_session) -> RAGDocumentCRUD:
        """Provide a RAGDocumentCRUD instance for testing."""
        return RAGDocumentCRUD(db_session)

    @pytest.fixture
    def sample_document(self) -> RAGDocument:
        """Create a sample RAGDocument entity for testing."""
        # Use unique filename per test run to avoid conflicts with stale data
        unique_id = uuid4()
        return RAGDocument(
            id=unique_id,
            title="Test Document",
            filename=f"test-{unique_id}.txt",
            content_type="text/plain",
            content="This is test content",
        )

    @pytest.fixture
    async def persisted_document(self, crud, sample_document) -> RAGDocument:
        """Create and persist a sample document."""
        await crud.save(sample_document)
        return sample_document

    # =========================================================================
    # get_by_filename() Contract
    # =========================================================================

    async def test_get_by_filename_returns_document_when_exists(self, crud, persisted_document):
        """
        Contract: get_by_filename returns the document when it exists.
        """
        result = await crud.get_by_filename(persisted_document.filename)

        assert result is not None
        assert result.id == persisted_document.id
        assert result.filename == persisted_document.filename

    async def test_get_by_filename_returns_none_when_not_exists(self, crud):
        """
        Contract: get_by_filename returns None when document doesn't exist.
        """
        nonexistent_filename = f"nonexistent-{uuid4()}.txt"
        result = await crud.get_by_filename(nonexistent_filename)

        assert result is None

    async def test_get_by_filename_does_not_return_deleted(self, crud, persisted_document):
        """
        Contract: get_by_filename does not return soft-deleted documents.
        """
        await crud.delete(persisted_document)

        result = await crud.get_by_filename(persisted_document.filename)

        assert result is None

    # =========================================================================
    # search_by_embedding() Contract
    # =========================================================================

    async def test_search_by_embedding_returns_similar_documents(self, crud, persisted_document):
        """
        Contract: search_by_embedding returns documents with similarity above threshold.
        """
        # Create a mock embedding (1536 dimensions for Azure OpenAI)
        mock_embedding = list(np.random.rand(1536).astype(np.float32))

        # Note: This test may return empty results if no documents match the threshold
        # The contract is that it returns a list of tuples (document, similarity_score)
        results = await crud.search_by_embedding(
            embedding=mock_embedding,
            limit=10,
            threshold=0.0,  # Low threshold to ensure we get results
        )

        assert isinstance(results, list)
        for doc, score in results:
            assert isinstance(doc, RAGDocument)
            assert isinstance(score, float)
            assert 0.0 <= score <= 1.0

    async def test_search_by_embedding_respects_limit(self, crud):
        """
        Contract: search_by_embedding respects the limit parameter.
        """
        mock_embedding = list(np.random.rand(1536).astype(np.float32))

        results = await crud.search_by_embedding(
            embedding=mock_embedding,
            limit=5,
            threshold=0.0,
        )

        assert len(results) <= 5

    async def test_search_by_embedding_respects_threshold(self, crud):
        """
        Contract: search_by_embedding only returns documents above threshold.
        """
        mock_embedding = list(np.random.rand(1536).astype(np.float32))

        results = await crud.search_by_embedding(
            embedding=mock_embedding,
            limit=10,
            threshold=0.9,  # High threshold
        )

        for doc, score in results:
            assert score >= 0.9

    # =========================================================================
    # get_documents_without_embedding() Contract
    # =========================================================================

    async def test_get_documents_without_embedding_returns_only_null_embeddings(
        self, crud, persisted_document
    ):
        """
        Contract: get_documents_without_embedding returns only documents with NULL embedding.
        """
        # Ensure the document has no embedding
        persisted_document.embedding = None
        await crud.save(persisted_document)

        results = await crud.get_documents_without_embedding(limit=100)

        assert isinstance(results, list)
        for doc in results:
            assert doc.embedding is None

    async def test_get_documents_without_embedding_respects_limit(self, crud):
        """
        Contract: get_documents_without_embedding respects the limit parameter.
        """
        results = await crud.get_documents_without_embedding(limit=5)

        assert len(results) <= 5


