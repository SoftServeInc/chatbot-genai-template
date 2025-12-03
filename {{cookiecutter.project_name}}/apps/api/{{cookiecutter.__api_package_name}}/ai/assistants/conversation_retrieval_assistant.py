"""
Conversation retrieval assistant using LCEL (LangChain Expression Language).

This module implements a RAG-based conversational assistant using LangChain's
Expression Language (LCEL) for composable, streaming-first chains with document retrieval.
"""

from typing import Any, AsyncIterable

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough

from ...models import Message, MessageRole
from ..llms import llm_provider
from .rag_document_retriever import RAGDocumentRetriever

# System prompt for RAG-based conversation
KNOWLEDGE_BASE_SEPARATOR = "=-=-=-=-="
COMBINE_DOCUMENTS_SEPARATOR = "*-*-*-*-*"

SYSTEM_PROMPT_TEMPLATE = (
    """You are an assistant that speaks the English language only.

For answering a user's question use only the information below that is delimited by \""""
    + KNOWLEDGE_BASE_SEPARATOR
    + """\" symbols. We call it a Knowledge Base. The different documents within the Knowledge Base are """
    + """separated by \""""
    + COMBINE_DOCUMENTS_SEPARATOR
    + """\" symbols.
Do not use your general knowledge outside the Knowledge Base to answer the question, i.e., to answer a question, use only information from the Knowledge Base.
The Knowledge Base is your single source of truth. You do not know anything other than what is contained in the Knowledge Base.
If the Knowledge Base does not provide an answer to the question or any information related to the question, then reply that you do not know the answer because the Knowledge Base does not contain enough information.
If the Knowledge Base provides an answer to the question, then use this information to generate the response, without additional details from outside the Knowledge Base.
The term "Knowledge Base" should be used in your answer only if there is not enough information in the Knowledge Base to answer the question. Otherwise, do not use the term "Knowledge Base" in your answer.
For example:
- Knowledge Base contains the following information: "Marry is a beautiful ladybug flying around. Marry has a friend named John. John is a grasshopper."
- If the user asks: "Who is Marry?" then your answer should not contain phrases like "Marry is a character who is mentioned in the Knowledge Base...", or "According to the Knowledge Base, Marry is...". Instead, your answer should be: "Marry is a beautiful ladybug flying around", i.e., not mentioning the "Knowledge Base" term.
- However, if the user asks: "Where does Marry live?" then your answer should be: "I do not know where Marry lives because my Knowledge Base does not contain this information.".

The Knowledge Base:
"""
    + KNOWLEDGE_BASE_SEPARATOR
    + """
{context}
"""
    + KNOWLEDGE_BASE_SEPARATOR
    + """
"""
)

RESPONSE_IF_NO_DOCS_FOUND = "Sorry, but I don't have any relevant information in my Knowledge Base."


def _convert_messages_to_langchain(messages: list[Message]) -> list[HumanMessage | AIMessage]:
    """Convert application Message objects to LangChain message format"""
    langchain_messages: list[HumanMessage | AIMessage] = []

    # Sort by created_at to ensure correct order
    sorted_messages = sorted(messages, key=lambda m: m.created_at)

    for message in sorted_messages:
        content = message.content
        if message.role == MessageRole.USER:
            langchain_messages.append(HumanMessage(content=content))
        elif message.role == MessageRole.ASSISTANT:
            langchain_messages.append(AIMessage(content=content))

    return langchain_messages


def _format_documents(documents: list) -> str:
    """Format retrieved documents into a single context string"""
    if not documents:
        return RESPONSE_IF_NO_DOCS_FOUND

    formatted_docs = []
    for doc in documents:
        formatted_docs.append(doc.page_content)

    return f"\n\n{COMBINE_DOCUMENTS_SEPARATOR}\n\n".join(formatted_docs)


class ConversationRetrievalAssistantLCEL:
    """
    Base conversation retrieval assistant using LCEL (LangChain Expression Language).

    This uses the modern LangChain approach with:
    - Document retrieval via RAGDocumentRetriever
    - ChatPromptTemplate for structured prompts
    - Pipe operator (|) for composing chains
    - Native streaming support
    """

    def __init__(self, retriever: RAGDocumentRetriever, streaming: bool = False):
        """
        Initialize the retrieval assistant.

        Args:
            retriever: RAGDocumentRetriever instance for document retrieval
            streaming: Whether to use streaming mode
        """
        self.streaming = streaming
        self.retriever = retriever
        self._llm = llm_provider.create_chat_llm(streaming=streaming)
        self._chain = self._build_chain()

    def _build_chain(self):
        """Build the LCEL chain with retrieval"""
        # Create prompt template
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content=SYSTEM_PROMPT_TEMPLATE),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{question}"),
            ]
        )

        # Build chain: retrieve -> format context -> prompt -> LLM -> parse
        return (
            RunnablePassthrough.assign(context=lambda x: _format_documents(x.get("documents", [])))
            | RunnablePassthrough.assign(chat_history=lambda x: x.get("chat_history", []))
            | prompt
            | self._llm
            | StrOutputParser()
        )

    async def _prepare_inputs(self, question: str, previous_messages: list[Message]) -> dict[str, Any]:
        """Prepare inputs for the chain including document retrieval"""
        # Retrieve relevant documents
        documents = await self.retriever.ainvoke(question)

        return {
            "question": question,
            "chat_history": _convert_messages_to_langchain(previous_messages),
            "documents": documents,
        }


class ConversationRetrievalAssistantBuffered(ConversationRetrievalAssistantLCEL):
    """
    Conversation retrieval assistant that returns buffered (complete) responses.

    Uses LCEL's ainvoke() for async execution.
    """

    def __init__(self, retriever: RAGDocumentRetriever):
        super().__init__(retriever, streaming=False)

    async def generate(self, question: str, previous_messages: list[Message]) -> str:
        """Generate a complete response to the given question using RAG"""
        inputs = await self._prepare_inputs(question, previous_messages)
        response = await self._chain.ainvoke(inputs)
        return response.strip()


class ConversationRetrievalAssistantStreamed(ConversationRetrievalAssistantLCEL):
    """
    Conversation retrieval assistant that streams responses token by token.

    Uses LCEL's astream() for async streaming.
    """

    def __init__(self, retriever: RAGDocumentRetriever):
        super().__init__(retriever, streaming=True)

    async def generate(self, question: str, previous_messages: list[Message]) -> AsyncIterable[str]:
        """Generate a streamed response to the given question using RAG"""
        inputs = await self._prepare_inputs(question, previous_messages)
        first_chunk = True

        async for chunk in self._chain.astream(inputs):
            if first_chunk:
                # Strip leading whitespace from first chunk
                chunk = chunk.lstrip()
                first_chunk = False
            yield chunk
