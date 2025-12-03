# RAG Implementation Guide

This document describes the RAG (Retrieval-Augmented Generation) implementation in this project, including when and how to use LangGraph for advanced RAG scenarios.

## Simple LangChain RAG (Current Implementation)

### Overview

The current implementation uses a simple LCEL (LangChain Expression Language) approach for RAG. This is sufficient for most use cases and provides:

- **Simplicity**: Easy to understand and maintain
- **Performance**: Efficient for straightforward retrieval and generation
- **Flexibility**: Can be extended as needed

### Architecture

The RAG flow follows this pattern:

```
User Question
    ↓
Generate Query Embedding
    ↓
Vector Similarity Search (RAGDocumentCRUD)
    ↓
Retrieve Relevant Documents
    ↓
Format Documents as Context
    ↓
LCEL Chain: Prompt → LLM → Response
```

### Code Structure

The implementation consists of:

1. **RAGDocumentRetriever** (`api/ai/assistants/rag_document_retriever.py`):
   - Extends LangChain's `BaseRetriever` interface
   - Overrides protected methods `_aget_relevant_documents()` and `_get_relevant_documents()`
   - Public API: `ainvoke(query)` for async, `invoke(query)` for sync
   - Converts query text to embeddings
   - Searches for similar documents using `RAGDocumentCRUD.search_by_embedding()`
   - Returns LangChain `Document` objects

2. **ConversationRetrievalAssistant** (`api/ai/assistants/conversation_retrieval_assistant.py`):
   - Uses LCEL chains with pipe operator (`|`)
   - Supports both buffered and streamed responses
   - Formats retrieved documents into context
   - Generates responses using the LLM

### Example Usage

```python
from api.ai.assistants.rag_document_retriever import RAGDocumentRetriever
from api.ai.assistants.conversation_retrieval_assistant import (
    ConversationRetrievalAssistantBuffered,
)
from api.crud.rag_document_crud import RAGDocumentCRUD
from api.app.settings import settings

# Initialize retriever with settings from environment variables
document_crud = RAGDocumentCRUD(session)
retriever = RAGDocumentRetriever(
    document_crud,
    limit=settings.RAG.retrieval_limit,      # Default: 10
    threshold=settings.RAG.retrieval_threshold  # Default: 0.5
)

# Create assistant (uses settings.RAG.allow_general_knowledge_fallback by default)
assistant = ConversationRetrievalAssistantBuffered(retriever)

# Generate response
response = await assistant.generate(
    question="What is the capital of France?",
    previous_messages=[]
)

# Or use the retriever directly with public API
documents = await retriever.ainvoke("What is the capital of France?")
```

### When This Approach is Sufficient

The simple LCEL approach works well for:

- **Direct Q&A**: Questions that can be answered with retrieved documents
- **Single-step retrieval**: One retrieval pass is sufficient
- **Straightforward reasoning**: No need for iterative refinement
- **Standard RAG patterns**: Most common RAG use cases

## Advanced: When to Use LangGraph for RAG

LangGraph provides value over simple LCEL chains when you need:

### 1. Complex Multi-Step Reasoning

**Use LangGraph when:**
- You need to break down complex questions into sub-questions
- Multiple retrieval passes are required
- Iterative refinement of answers is needed

**Example Scenario:**
```
User: "Compare the features of Product A and Product B"
  ↓
Step 1: Retrieve info about Product A
Step 2: Retrieve info about Product B
Step 3: Compare and synthesize
```

### 2. Conditional Branching Based on Retrieval Quality

**Use LangGraph when:**
- You need to check if retrieved documents are relevant
- Different strategies based on retrieval results
- Fallback mechanisms when retrieval fails

**Example Scenario:**
```
Retrieve Documents
  ↓
Check Relevance Score
  ├─ High Score → Use Documents
  └─ Low Score → Try Alternative Query or Use General Knowledge
```

### 3. Multi-Agent RAG Systems

**Use LangGraph when:**
- Multiple specialized agents work together
- Different agents handle different aspects
- Coordination between agents is needed

**Example Scenario:**
```
Query Router Agent
  ├─ Technical Questions → Technical Agent
  ├─ General Questions → General Agent
  └─ Comparison Questions → Comparison Agent
```

### 4. RAG with Human-in-the-Loop Feedback

**Use LangGraph when:**
- User feedback affects retrieval strategy
- Iterative improvement based on feedback
- Adaptive retrieval based on user preferences

### 5. Self-Correcting RAG

**Use LangGraph when:**
- Verify answer quality before returning
- Re-retrieve if answer is insufficient
- Self-validation and correction loops

## LangGraph RAG Examples

### Example 1: Self-Correcting RAG with Relevance Checking

This example shows how to use LangGraph to verify retrieval quality and re-retrieve if needed:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List
from langchain_core.documents import Document

class RAGState(TypedDict):
    question: str
    documents: List[Document]
    answer: str
    relevance_score: float
    iteration: int

async def retrieve_documents(state: RAGState) -> RAGState:
    """Retrieve documents for the question"""
    retriever = RAGDocumentRetriever(document_crud)
    # Use the public API ainvoke() instead of protected _aget_relevant_documents()
    docs = await retriever.ainvoke(state["question"])
    return {**state, "documents": docs}

def check_relevance(state: RAGState) -> RAGState:
    """Check if retrieved documents are relevant"""
    if not state["documents"]:
        return {**state, "relevance_score": 0.0}

    # Calculate average similarity score
    avg_score = sum(doc.metadata.get("similarity", 0)
                    for doc in state["documents"]) / len(state["documents"])
    return {**state, "relevance_score": avg_score}

def generate_answer(state: RAGState) -> RAGState:
    """Generate answer from documents"""
    assistant = ConversationRetrievalAssistantBuffered(retriever)
    answer = await assistant.generate(state["question"], [])
    return {**state, "answer": answer}

def should_retry(state: RAGState) -> str:
    """Decide if we should retry with different query"""
    if state["relevance_score"] < 0.5 and state["iteration"] < 2:
        return "retry"
    return "end"

# Build the graph
workflow = StateGraph(RAGState)
workflow.add_node("retrieve", retrieve_documents)
workflow.add_node("check_relevance", check_relevance)
workflow.add_node("generate", generate_answer)
workflow.add_conditional_edges("check_relevance", should_retry)
workflow.add_edge("generate", END)
workflow.set_entry_point("retrieve")

# Compile and run
app = workflow.compile()
result = await app.ainvoke({"question": "What is...", "iteration": 0})
```

### Example 2: Multi-Step RAG with Query Decomposition

This example shows how to break down complex questions:

```python
from langgraph.graph import StateGraph, END

class MultiStepRAGState(TypedDict):
    original_question: str
    sub_questions: List[str]
    sub_answers: List[str]
    final_answer: str

def decompose_question(state: MultiStepRAGState) -> MultiStepRAGState:
    """Break down complex question into sub-questions"""
    # Use LLM to decompose question
    prompt = f"Break this question into sub-questions: {state['original_question']}"
    # ... generate sub-questions
    return {**state, "sub_questions": ["Question 1", "Question 2"]}

def answer_sub_question(state: MultiStepRAGState) -> MultiStepRAGState:
    """Answer each sub-question"""
    retriever = RAGDocumentRetriever(document_crud)
    assistant = ConversationRetrievalAssistantBuffered(retriever)

    answers = []
    for question in state["sub_questions"]:
        answer = await assistant.generate(question, [])
        answers.append(answer)

    return {**state, "sub_answers": answers}

def synthesize_final_answer(state: MultiStepRAGState) -> MultiStepRAGState:
    """Combine sub-answers into final answer"""
    # Use LLM to synthesize
    context = "\n".join(f"Q: {q}\nA: {a}"
                       for q, a in zip(state["sub_questions"], state["sub_answers"]))
    # ... generate final answer
    return {**state, "final_answer": "..."}

workflow = StateGraph(MultiStepRAGState)
workflow.add_node("decompose", decompose_question)
workflow.add_node("answer_sub", answer_sub_question)
workflow.add_node("synthesize", synthesize_final_answer)
workflow.add_edge("decompose", "answer_sub")
workflow.add_edge("answer_sub", "synthesize")
workflow.add_edge("synthesize", END)
workflow.set_entry_point("decompose")
```

### Example 3: Adaptive RAG with Multiple Retrieval Strategies

This example shows routing between different retrieval strategies:

```python
from langgraph.graph import StateGraph, END

class AdaptiveRAGState(TypedDict):
    question: str
    strategy: str
    documents: List[Document]
    answer: str

def route_strategy(state: AdaptiveRAGState) -> str:
    """Choose retrieval strategy based on question"""
    question = state["question"].lower()

    if "compare" in question or "difference" in question:
        return "comparison"
    elif "how" in question or "why" in question:
        return "detailed"
    else:
        return "standard"

async def standard_retrieval(state: AdaptiveRAGState) -> AdaptiveRAGState:
    """Standard vector similarity search"""
    retriever = RAGDocumentRetriever(document_crud, limit=5)
    docs = await retriever.ainvoke(state["question"])
    return {**state, "documents": docs, "strategy": "standard"}

async def comparison_retrieval(state: AdaptiveRAGState) -> AdaptiveRAGState:
    """Retrieve documents for comparison"""
    # Extract entities to compare
    # Retrieve documents for each entity
    retriever = RAGDocumentRetriever(document_crud)
    # ... specialized comparison logic
    docs = await retriever.ainvoke(state["question"])
    return {**state, "documents": docs, "strategy": "comparison"}

async def detailed_retrieval(state: AdaptiveRAGState) -> AdaptiveRAGState:
    """Retrieve more documents for detailed questions"""
    retriever = RAGDocumentRetriever(document_crud, limit=10, threshold=0.6)
    docs = await retriever.ainvoke(state["question"])
    return {**state, "documents": docs, "strategy": "detailed"}

workflow = StateGraph(AdaptiveRAGState)
workflow.add_node("standard", standard_retrieval)
workflow.add_node("comparison", comparison_retrieval)
workflow.add_node("detailed", detailed_retrieval)
workflow.add_conditional_edges("route", route_strategy, {
    "standard": "standard",
    "comparison": "comparison",
    "detailed": "detailed"
})
```

## Comparison: Simple LCEL vs LangGraph

| Feature | Simple LCEL | LangGraph |
|---------|-------------|-----------|
| **Complexity** | Low | Medium-High |
| **Use Case** | Standard RAG | Advanced RAG |
| **Multi-step** | No | Yes |
| **Conditional Logic** | Limited | Full support |
| **State Management** | Manual | Built-in |
| **Debugging** | Easy | More complex |
| **Performance** | Fast | Slightly slower |
| **Maintenance** | Easy | Moderate |

## Configuration Parameters

The RAG system can be configured using environment variables. All RAG-related settings are under the `RAG_` prefix:

### Core RAG Settings

- **`RAG_ENABLED`** (default: `true`)
  - Enable or disable RAG functionality globally
  - When disabled, all chats will use the standard conversation assistant

- **`RAG_EMBEDDING_DIMENSIONS`** (default: `1536`)
  - Dimensionality of the embedding vectors
  - Must match the embedding model being used (e.g., Azure OpenAI text-embedding-ada-002 uses 1536)
  - Changing this requires re-embedding all existing documents

### Document Processing Settings

- **`RAG_CHUNK_SIZE`** (default: `1000`)
  - Maximum number of characters per document chunk
  - Larger chunks provide more context but may include irrelevant information
  - Smaller chunks are more focused but may lose context

- **`RAG_CHUNK_OVERLAP`** (default: `200`)
  - Number of characters to overlap between consecutive chunks
  - Helps maintain context across chunk boundaries
  - Should be less than `RAG_CHUNK_SIZE`

- **`RAG_MAX_FILE_SIZE_MB`** (default: `10`)
  - Maximum file size in megabytes for uploaded documents
  - Larger files take longer to process and embed

- **`RAG_ALLOWED_EXTENSIONS`** (default: `.txt,.pdf,.docx,.doc`)
  - Comma-separated list of allowed file extensions
  - Only files with these extensions can be uploaded to the Knowledge Base

### Retrieval Settings

- **`RAG_RETRIEVAL_THRESHOLD`** (default: `0.5`)
  - Minimum similarity score (0.0-1.0) for documents to be retrieved
  - **Lower values (0.3-0.5)**: More documents retrieved, better recall but may include less relevant results
  - **Medium values (0.5-0.7)**: Balanced precision and recall (recommended starting point)
  - **Higher values (0.7-0.9)**: Only very similar documents retrieved, better precision but may miss relevant results
  - **Guidelines:**
    - Use 0.5-0.6 for general use cases
    - Use 0.7+ when precision is critical
    - Use 0.3-0.5 when recall is more important than precision

- **`RAG_RETRIEVAL_LIMIT`** (default: `10`)
  - Maximum number of documents to retrieve per query
  - More documents provide more context but:
    - Increase processing time
    - May include less relevant information
    - Increase token usage
  - **Best Practices:**
    - Start with 5-10 documents
    - Increase to 15-20 if answers are incomplete
    - Decrease if answers include too much irrelevant information

### Knowledge Base Behavior Settings

- **`RAG_ALLOW_GENERAL_KNOWLEDGE_FALLBACK`** (default: `false`)
  - When `true`: Allows the LLM to use its general knowledge when the Knowledge Base is empty or doesn't contain relevant information
  - When `false`: Strict mode - only uses Knowledge Base content, responds with "I don't know" if KB is insufficient
  - **Use Cases:**
    - Set to `true` if you want helpful answers even when KB is empty
    - Set to `false` if you want strict control and only KB-based answers
  - **Note**: When enabled, the system prioritizes KB content but can fall back to general knowledge

## Tips and Tricks

### Adjusting Similarity Thresholds

The similarity threshold controls how strict document matching is. Configure via `RAG_RETRIEVAL_THRESHOLD`:

```python
# Strict matching (only very similar documents)
# Set RAG_RETRIEVAL_THRESHOLD=0.8

# Moderate matching (default)
# Set RAG_RETRIEVAL_THRESHOLD=0.5

# Loose matching (more documents, may include less relevant)
# Set RAG_RETRIEVAL_THRESHOLD=0.3
```

**Guidelines:**
- **High threshold (0.8+)**: Use when precision is critical
- **Medium threshold (0.5-0.7)**: Good balance for most cases (default: 0.5)
- **Low threshold (0.3-0.5)**: Use when recall is more important than precision

### Tuning Retrieval Parameters

Configure via environment variables:

```bash
# More documents = more context, but slower
RAG_RETRIEVAL_LIMIT=10        # Number of documents to retrieve
RAG_RETRIEVAL_THRESHOLD=0.5   # Similarity threshold
```

**Best Practices:**
- Start with `RAG_RETRIEVAL_LIMIT=10` and `RAG_RETRIEVAL_THRESHOLD=0.5`
- Increase limit if answers are incomplete
- Increase threshold if answers include irrelevant information
- Decrease threshold if you're getting "I don't know" responses too often

### Debugging RAG Chains

1. **Check retrieved documents:**
```python
# Use the public API ainvoke()
documents = await retriever.ainvoke(query)
for doc in documents:
    print(f"Score: {doc.metadata['similarity']}")
    print(f"Content: {doc.page_content[:100]}...")
```

2. **Verify embeddings:**
```python
embedding = await llm_provider.create_embedding_llm().aembed_query(query)
print(f"Embedding dimensions: {len(embedding)}")
```

3. **Monitor chain execution:**
```python
# Enable verbose mode in settings
settings.LLM.verbose = True
```

### Streaming vs Buffered Responses

**Buffered (complete response):**
```python
assistant = ConversationRetrievalAssistantBuffered(retriever)
response = await assistant.generate(question, messages)
```

**Streamed (token by token):**
```python
assistant = ConversationRetrievalAssistantStreamed(retriever)
async for chunk in assistant.generate(question, messages):
    yield chunk
```

**When to use each:**
- **Buffered**: When you need the complete response before processing
- **Streamed**: For better user experience in chat interfaces

### Performance Considerations

1. **Embedding Generation**: Cache embeddings for frequently asked questions
2. **Document Indexing**: Use HNSW index for fast vector search (already configured)
3. **Batch Processing**: Process multiple queries together when possible
4. **Connection Pooling**: Reuse database connections

## Troubleshooting

### Issue: No documents retrieved

**Possible causes:**
- Threshold too high
- No documents in database
- Embedding mismatch (wrong dimensions)

**Solutions:**
- Lower the threshold
- Verify documents exist and have embeddings
- Check embedding dimensions match settings

### Issue: Irrelevant documents retrieved

**Possible causes:**
- Threshold too low
- Poor document quality
- Embedding model mismatch

**Solutions:**
- Increase threshold
- Improve document quality and preprocessing
- Ensure consistent embedding model

### Issue: Slow retrieval

**Possible causes:**
- Too many documents
- Missing HNSW index
- Large embedding dimensions

**Solutions:**
- Reduce limit parameter
- Verify HNSW index exists
- Consider reducing embedding dimensions

## Implementation Details

### RAGDocumentRetriever Pattern

The `RAGDocumentRetriever` follows the LangChain `BaseRetriever` pattern:

```python
from langchain_core.callbacks.manager import (
    AsyncCallbackManagerForRetrieverRun,
    CallbackManagerForRetrieverRun,
)
from langchain_core.retrievers import BaseRetriever

class RAGDocumentRetriever(BaseRetriever):
    """Custom retriever implementation"""

    # Required for Pydantic model (BaseRetriever extends Pydantic)
    model_config = {"arbitrary_types_allowed": True, "extra": "allow"}

    def __init__(self, document_crud: RAGDocumentCRUD, limit: int = 5, threshold: float = 0.7):
        super().__init__()
        self.document_crud = document_crud
        self.limit = limit
        self.threshold = threshold

    # Override protected method - called by public ainvoke()
    async def _aget_relevant_documents(
        self, query: str, *, run_manager: AsyncCallbackManagerForRetrieverRun
    ) -> list[Document]:
        """Your custom retrieval logic"""
        # ... implementation ...
        return documents

    # Override protected method - called by public invoke()
    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> list[Document]:
        """Sync version (if needed)"""
        raise NotImplementedError("Use async version")
```

**Key Points:**
- **Override protected methods**: `_aget_relevant_documents()` and `_get_relevant_documents()`
- **Use public methods**: `ainvoke(query)` and `invoke(query)` - these automatically create callback managers
- **Callback managers**: Required parameters from base class - handle logging, tracing, and callbacks
- **Pydantic config**: BaseRetriever extends Pydantic, so configure `model_config` for custom attributes

**Usage:**
```python
# ✅ Correct: Use public API
documents = await retriever.ainvoke("query")

# ❌ Wrong: Don't call protected method directly
# documents = await retriever._aget_relevant_documents("query")  # Missing run_manager!
```

## Conclusion

- **Use Simple LCEL** for most RAG use cases - it's simpler, faster, and easier to maintain
- **Use LangGraph** when you need advanced features like multi-step reasoning, conditional branching, or complex state management
- **Follow LangChain patterns**: Use public APIs (`ainvoke`), override protected methods correctly

The current implementation provides a solid foundation that can be extended with LangGraph when needed.


