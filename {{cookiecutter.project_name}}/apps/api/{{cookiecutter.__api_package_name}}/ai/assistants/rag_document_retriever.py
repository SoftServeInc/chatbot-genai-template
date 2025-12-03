"""Document retriever for RAG functionality using LangChain BaseRetriever interface"""

from langchain_core.callbacks.manager import (
    AsyncCallbackManagerForRetrieverRun,
    CallbackManagerForRetrieverRun,
)
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever

from ...crud.rag_document_crud import RAGDocumentCRUD
from ..llms import llm_provider


class RAGDocumentRetriever(BaseRetriever):
    """
    LangChain retriever that uses RAGDocumentCRUD for vector similarity search.

    This retriever converts query text to embeddings and searches for similar documents
    using the RAG document CRUD service.
    """

    # Required because RAGDocumentCRUD is not a Pydantic model and needs to be stored in BaseRetriever
    model_config = {"arbitrary_types_allowed": True, "extra": "allow"}

    def __init__(
        self,
        document_crud: RAGDocumentCRUD,
        limit: int = 5,
        threshold: float = 0.7,
    ):
        """
        Initialize the RAG document retriever.

        Args:
            document_crud: RAGDocumentCRUD instance for document operations
            limit: Maximum number of documents to retrieve
            threshold: Minimum similarity score (0-1, higher is more similar)
        """
        super().__init__()
        self.document_crud = document_crud
        self.limit = limit
        self.threshold = threshold
        self._embedding_llm = None

    @property
    def embedding_llm(self):
        """Lazy load embedding LLM"""
        if self._embedding_llm is None:
            self._embedding_llm = llm_provider.create_embedding_llm()
        return self._embedding_llm

    async def _aget_relevant_documents(
        self, query: str, *, run_manager: AsyncCallbackManagerForRetrieverRun
    ) -> list[Document]:
        """
        Retrieve documents relevant to the query.

        Args:
            query: The query string to search for
            run_manager: Async callback manager for retriever run

        Returns:
            List of LangChain Document objects
        """
        # Generate embedding for the query
        embedding = await self.embedding_llm.aembed_query(query)
        embedding_list = list(embedding)

        # Search for similar documents
        results = await self.document_crud.search_by_embedding(
            embedding=embedding_list,
            limit=self.limit,
            threshold=self.threshold,
        )

        # Convert RAGDocument to LangChain Document
        documents = []
        for rag_doc, similarity in results:
            doc = Document(
                page_content=rag_doc.content,
                metadata={
                    "id": str(rag_doc.id),
                    "title": rag_doc.title,
                    "filename": rag_doc.filename,
                    "content_type": rag_doc.content_type,
                    "similarity": similarity,
                    **(rag_doc.doc_metadata or {}),
                },
            )
            documents.append(doc)

        return documents

    def _get_relevant_documents(self, query: str, *, run_manager: CallbackManagerForRetrieverRun) -> list[Document]:
        """
        Synchronous version (not implemented - use async version).

        Raises:
            NotImplementedError: Always, as this retriever is async-only
        """
        raise NotImplementedError("This retriever only supports async operations")
