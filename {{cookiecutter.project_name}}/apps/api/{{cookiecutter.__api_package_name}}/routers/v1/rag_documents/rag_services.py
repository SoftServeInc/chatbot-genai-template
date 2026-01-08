"""File parsing and validation services for RAG document upload"""

from dataclasses import dataclass
from logging import getLogger

import numpy as np
from fastapi import UploadFile

from ....ai.llms import llm_provider
from ....app.settings import settings
from .rag_file_parsers import PARSER_MAP

logger = getLogger(__name__)


class FileValidationError(Exception):
    """Raised when file validation fails"""

    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


@dataclass
class ParsedFile:
    """Result of file validation and parsing"""

    content: bytes
    text_content: str
    filename: str
    content_type: str
    file_ext: str


def _get_file_extension(filename: str) -> str:
    """Extract lowercase file extension from filename (e.g., '.pdf')"""
    return "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def _get_allowed_extensions() -> list[str]:
    extensions = settings.RAG.allowed_extensions.split(",")
    # filter out extensions that are not supported by parser module
    return [extension for extension in extensions if extension in PARSER_MAP]


async def validate_and_parse_file(file: UploadFile) -> ParsedFile:
    """
    Validate and parse an uploaded file.

    Performs:
    - File extension validation
    - File size validation
    - Text content extraction

    Args:
        file: The uploaded file

    Returns:
        ParsedFile with validated content and extracted text

    Raises:
        FileValidationError: If validation fails
    """
    filename = file.filename or "unknown"
    file_ext = _get_file_extension(filename)

    # Validate file extension
    if file_ext not in _get_allowed_extensions():
        raise FileValidationError(
            f"File type not allowed. Allowed types: {', '.join(_get_allowed_extensions())}",
            status_code=400,
        )

    # Read and validate file size
    content = await file.read()
    max_size = settings.RAG.max_file_size_mb * 1024 * 1024
    if len(content) > max_size:
        raise FileValidationError(
            f"File too large. Maximum size: {settings.RAG.max_file_size_mb}MB",
            status_code=413,
        )

    # Extract text content
    content_type = file.content_type or ""
    text_content = PARSER_MAP[file_ext](content)

    if not text_content.strip():
        raise FileValidationError("Could not extract text content from file")

    return ParsedFile(
        content=content,
        text_content=text_content,
        filename=filename,
        content_type=content_type,
        file_ext=file_ext,
    )


async def generate_embedding(text: str) -> np.ndarray:
    """Generate embedding vector for text using configured LLM provider"""
    embedding_llm = llm_provider.create_embedding_llm()
    embedding = await embedding_llm.aembed_query(text)
    # Convert to numpy array for pgvector compatibility
    return np.array(embedding, dtype=np.float32)
