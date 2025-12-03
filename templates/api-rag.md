## 🔍 RAG (Retrieval-Augmented Generation)

This application supports RAG functionality for enhanced chat conversations. When RAG is enabled:

- **Chats can be configured** with `rag_enabled` flag to use document retrieval
- **RAG-enabled chats** use retrieval assistant that searches through uploaded documents
- **Generic chats** use standard conversation assistant without document retrieval

### Configuration

- Set `RAG_ENABLED=true` in your `.env` file to enable RAG features
- When creating a chat, set `rag_enabled: true` in the request to enable RAG for that chat
- The default value for `rag_enabled` depends on whether RAG is enabled in settings

### Environment Variables

The following environment variables can be configured for RAG functionality:

- `RAG_ENABLED` - Enable/disable RAG features (default: `true`)
- `RAG_EMBEDDING_DIMENSIONS` - Vector embedding dimensions (default: `1536` for Azure OpenAI text-embedding-ada-002)
- `RAG_CHUNK_SIZE` - Text chunk size for document processing (default: `1000`)
- `RAG_CHUNK_OVERLAP` - Overlap between chunks (default: `200`)
- `RAG_MAX_FILE_SIZE_MB` - Maximum file size for uploads in MB (default: `10`)
- `RAG_ALLOWED_EXTENSIONS` - Comma-separated list of allowed file extensions (default: `.txt,.pdf,.docx,.doc`)

### API Endpoints

When RAG is enabled, the following endpoints are available under `/api/v1/rag/documents`:

- `POST /create` - Create a new RAG document from text content
- `POST /upload` - Upload a file (txt, pdf, docx) and create a RAG document
- `GET /` - Get a paginated list of all RAG documents
- `GET /{document_id}` - Get a single RAG document by ID
- `PATCH /{document_id}` - Update a RAG document's title, content, or metadata (regenerates embedding if content changed)
- `DELETE /{document_id}` - Delete a RAG document by ID
- `POST /search` - Search RAG documents by semantic similarity using vector embeddings

### Usage Workflow

1. **Upload Documents**: Use `POST /upload` or `POST /create` to add documents to the RAG system
2. **Create RAG-enabled Chat**: Create a new chat with `rag_enabled: true`
3. **Chat with RAG**: When you send messages to a RAG-enabled chat, the assistant will automatically search through uploaded documents and include relevant context in its responses

### Technical Details

- Documents are automatically chunked and embedded using the configured LLM provider's embedding model
- Vector embeddings are stored using the [pgvector](https://github.com/pgvector/pgvector) PostgreSQL extension
- Similarity search uses cosine distance to find the most relevant document chunks
- Embeddings are automatically regenerated when document content is updated

For detailed information about RAG implementation, including when to use LangGraph for advanced scenarios, see [`docs/RAG_IMPLEMENTATION.md`](docs/RAG_IMPLEMENTATION.md).
