"""
Contract tests for RAG conversation assistants.

These tests verify that RAG assistant interfaces work correctly.
Focus is on STRUCTURE and INTERFACES, not execution (execution tests require real LLM credentials).

For full execution testing, use integration tests with real LLM credentials.
"""

import pytest


class TestRAGAssistantStructure:
    """
    Verify RAG conversation assistants have correct structure.

    These are structural tests - they verify classes can be instantiated
    and have the right interfaces, but don't execute complex logic.
    """

    @pytest.fixture
    def mock_retriever(self, db_session):
        """Create a mock retriever for testing."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.rag_document_retriever import RAGDocumentRetriever
        from {{ cookiecutter.__api_package_name }}.crud.rag_document_crud import RAGDocumentCRUD

        document_crud = RAGDocumentCRUD(db_session)
        return RAGDocumentRetriever(document_crud)

    def test_buffered_rag_assistant_can_be_instantiated(self, mock_retriever):
        """Buffered RAG assistant can be created."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.conversation_retrieval_assistant import (
            ConversationRetrievalAssistantBuffered,
        )

        assistant = ConversationRetrievalAssistantBuffered(mock_retriever)
        assert assistant is not None

    def test_streaming_rag_assistant_can_be_instantiated(self, mock_retriever):
        """Streaming RAG assistant can be created."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.conversation_retrieval_assistant import (
            ConversationRetrievalAssistantStreamed,
        )

        assistant = ConversationRetrievalAssistantStreamed(mock_retriever)
        assert assistant is not None

    def test_buffered_rag_assistant_has_generate_method(self, mock_retriever):
        """Buffered RAG assistant has generate() method."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.conversation_retrieval_assistant import (
            ConversationRetrievalAssistantBuffered,
        )

        assistant = ConversationRetrievalAssistantBuffered(mock_retriever)

        # Verify required methods exist
        assert hasattr(assistant, "generate"), "Missing generate() method"
        assert callable(assistant.generate)

    def test_streaming_rag_assistant_has_generate_method(self, mock_retriever):
        """Streaming RAG assistant has generate() method."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.conversation_retrieval_assistant import (
            ConversationRetrievalAssistantStreamed,
        )

        assistant = ConversationRetrievalAssistantStreamed(mock_retriever)

        assert hasattr(assistant, "generate"), "Missing generate() method"
        assert callable(assistant.generate)

    def test_rag_assistant_has_internal_chain(self, mock_retriever):
        """RAG assistant builds internal LangChain chain."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.conversation_retrieval_assistant import (
            ConversationRetrievalAssistantBuffered,
        )

        assistant = ConversationRetrievalAssistantBuffered(mock_retriever)

        # Verify it has a _chain attribute (internal structure)
        assert hasattr(assistant, "_chain")
        assert assistant._chain is not None


class TestDocumentRetrieverStructure:
    """
    Verify document retriever has correct structure.
    """

    def test_retriever_can_be_instantiated(self, db_session):
        """Document retriever can be created."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.rag_document_retriever import RAGDocumentRetriever
        from {{ cookiecutter.__api_package_name }}.crud.rag_document_crud import RAGDocumentCRUD

        document_crud = RAGDocumentCRUD(db_session)
        retriever = RAGDocumentRetriever(document_crud)
        assert retriever is not None

    def test_retriever_has_required_methods(self, db_session):
        """Document retriever has required methods."""
        from {{ cookiecutter.__api_package_name }}.ai.assistants.rag_document_retriever import RAGDocumentRetriever
        from {{ cookiecutter.__api_package_name }}.crud.rag_document_crud import RAGDocumentCRUD

        document_crud = RAGDocumentCRUD(db_session)
        retriever = RAGDocumentRetriever(document_crud)

        # Verify it has the public retrieval methods (from BaseRetriever)
        assert hasattr(retriever, "ainvoke"), "Missing ainvoke() public method"
        assert callable(retriever.ainvoke)

        assert hasattr(retriever, "invoke"), "Missing invoke() public method"
        assert callable(retriever.invoke)
