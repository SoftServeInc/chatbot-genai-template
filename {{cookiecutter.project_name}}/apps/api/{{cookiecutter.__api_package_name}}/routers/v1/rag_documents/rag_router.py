"""API router for RAG Document related endpoints"""

from logging import getLogger
from typing import Annotated, Any, cast
from uuid import UUID

import numpy as np
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Response,
    Security,
    UploadFile,
)

from ....ai.llms import llm_provider
from ....app.schemas import (
    DataRequest,
    DataResponse,
    JSONDataResponse,
    JSONPaginatedResponse,
    PaginatedResponse,
    PaginationQuery,
    responses,
)
from ....auth import auth_user_id
from ....crud.rag_document_crud import RAGDocumentCRUD
from ....models.rag_document import RAGDocument
from .rag_models import (
    CreateRAGDocumentRequest,
    RAGDocumentResponse,
    RAGSearchResultItem,
    SearchRAGDocumentsRequest,
    SearchRAGDocumentsResponse,
    UpdateRAGDocumentRequest,
)
from .rag_services import FileValidationError, validate_and_parse_file

logger = getLogger(__name__)

rag_documents = APIRouter(prefix="/rag/documents", tags=["rag"], dependencies=[Security(auth_user_id)])


@rag_documents.post(
    "/create",
    responses=cast(dict[int | str, dict[str, Any]], responses(422)),
    status_code=201,
    response_model=DataResponse[RAGDocumentResponse],
    description="Create a new RAG document from text content",
)
async def create_rag_document(
    request: DataRequest[CreateRAGDocumentRequest],
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Create a new RAG document with text content and generate embedding"""
    data = request.data

    # Generate embedding for the content
    embedding = await _generate_embedding(data.content)

    document = RAGDocument(
        title=data.title,
        filename=f"{data.title}.txt",
        content_type="text/plain",
        content=data.content,
        doc_metadata=data.doc_metadata,
        embedding=embedding,
    )

    await document_crud.save(document, modified=False)
    logger.info("Created RAG document %s with embedding", document.id)

    return JSONDataResponse(RAGDocumentResponse.from_document(document), 201)


@rag_documents.post(
    "/upload",
    responses=cast(dict[int | str, dict[str, Any]], responses(400, 413, 422)),
    status_code=201,
    response_model=DataResponse[RAGDocumentResponse],
    description="Upload a file (txt, pdf, docx) and create a RAG document",
)
async def upload_rag_document(
    file: Annotated[UploadFile, File(description="File to upload (txt, pdf, docx)")],
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Upload a file, extract text content, and generate embedding"""
    # Validate and parse file
    try:
        parsed = await validate_and_parse_file(file)
    except FileValidationError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message) from e

    # Generate embedding
    embedding = await _generate_embedding(parsed.text_content)

    document = RAGDocument(
        title=parsed.filename.rsplit(".", 1)[0] if "." in parsed.filename else parsed.filename,
        filename=parsed.filename,
        content_type=parsed.content_type or "application/octet-stream",
        content=parsed.text_content,
        embedding=embedding,
    )

    await document_crud.save(document, modified=False)
    logger.info("Uploaded RAG document %s (%s) with embedding", document.id, file.filename)

    return JSONDataResponse(RAGDocumentResponse.from_document(document), 201)


@rag_documents.get(
    "",
    responses=cast(dict[int | str, dict[str, Any]], responses()),
    response_model=PaginatedResponse[RAGDocumentResponse],
    description="Get a paginated list of all RAG documents",
)
async def get_rag_documents(
    pagination: Annotated[PaginationQuery, Depends()],
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Get a paginated list of all RAG documents"""
    paginated = await document_crud.get_all_paginated(pagination)

    return JSONPaginatedResponse(paginated.map(RAGDocumentResponse.from_document))


@rag_documents.get(
    "/{document_id}",
    responses=cast(dict[int | str, dict[str, Any]], responses(404)),
    response_model=DataResponse[RAGDocumentResponse],
    description="Get a single RAG document by ID",
)
async def get_rag_document(
    document_id: UUID,
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Get a single RAG document by its ID"""
    document = await document_crud.get_by_id(document_id, raise_not_found=True)

    return JSONDataResponse(RAGDocumentResponse.from_document(document))


@rag_documents.patch(
    "/{document_id}",
    responses=cast(dict[int | str, dict[str, Any]], responses(404, 422)),
    response_model=DataResponse[RAGDocumentResponse],
    description="Update a RAG document's title, content, or metadata",
)
async def update_rag_document(
    document_id: UUID,
    request: DataRequest[UpdateRAGDocumentRequest],
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Update a RAG document and regenerate embedding if content changed"""
    document = await document_crud.get_by_id(document_id, raise_not_found=True)
    data = request.data
    content_changed = False

    if data.title is not None:
        document.title = data.title

    if data.content is not None:
        document.content = data.content
        content_changed = True

    if data.doc_metadata is not None:
        document.doc_metadata = data.doc_metadata

    # Regenerate embedding if content changed
    if content_changed:
        document.embedding = await _generate_embedding(document.content)
        logger.info("Regenerated embedding for RAG document %s", document.id)

    await document_crud.save(document)

    return JSONDataResponse(RAGDocumentResponse.from_document(document))


@rag_documents.delete(
    "/{document_id}",
    responses=cast(dict[int | str, dict[str, Any]], responses(204, 404)),
    status_code=204,
    response_class=Response,
    description="Delete a RAG document by ID",
)
async def delete_rag_document(
    document_id: UUID,
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Delete a RAG document by its ID"""
    document = await document_crud.get_by_id(document_id, raise_not_found=True)

    await document_crud.delete(document)
    logger.info("Deleted RAG document %s", document_id)


@rag_documents.post(
    "/search",
    responses=cast(dict[int | str, dict[str, Any]], responses(422)),
    response_model=DataResponse[SearchRAGDocumentsResponse],
    description="Search RAG documents by semantic similarity",
)
async def search_rag_documents(
    request: DataRequest[SearchRAGDocumentsRequest],
    document_crud: Annotated[RAGDocumentCRUD, Depends()],
):
    """Search RAG documents using vector similarity"""
    data = request.data

    # Generate embedding for the search query
    query_embedding = await _generate_embedding(data.query)

    # Search by vector similarity
    results = await document_crud.search_by_embedding(
        embedding=query_embedding,
        limit=data.limit,
        threshold=data.threshold,
    )

    search_results = [
        RAGSearchResultItem(document=RAGDocumentResponse.from_document(doc), similarity=score) for doc, score in results
    ]

    return JSONDataResponse(SearchRAGDocumentsResponse(results=search_results, query=data.query))


async def _generate_embedding(text: str) -> np.ndarray:
    """Generate embedding vector for text using configured LLM provider"""
    embedding_llm = llm_provider.create_embedding_llm()
    embedding = await embedding_llm.aembed_query(text)
    # Convert to numpy array for pgvector compatibility
    return np.array(embedding, dtype=np.float32)
