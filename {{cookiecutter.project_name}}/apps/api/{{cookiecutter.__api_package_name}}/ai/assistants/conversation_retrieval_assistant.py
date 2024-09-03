"""
This module contains the conversational assistant. It is a simple wrapper around the ConversationChain class.
"""

from typing import AsyncIterable, ClassVar, cast

from langchain.chains.base import Chain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.conversational_retrieval.base import ConversationalRetrievalChain
from langchain.chains.llm import LLMChain
from langchain.prompts import (
    BasePromptTemplate,
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
)
from langchain.schema.retriever import BaseRetriever

from ...models import Message
from ..llms import llm_provider
from .abstract_assistant import IS_VERBOSE, OUTPUT_KEY, AbstractAssistant
from .utils import compose_history, get_number_of_tokens_left

# pylint: disable=line-too-long
CONDENSE_QUESTION_LENGTH = 800
CONDENSE_QUESTION_PROMPT = PromptTemplate.from_template(
    """Given the following conversation between a user and an assisstant, and a user's follow up question, rephrase the follow up question to be a standalone question, in English language.
The standalone question should be no longer than """
    + str(CONDENSE_QUESTION_LENGTH)
    + """ characters.

Conversation:
-----
{chat_history}
-----
Follow up question: {question}
-----
Standalone question: """
)

KNOWLEDGE_BASE_SEPARATOR = "=-=-=-=-="
COMBINE_DOCUMENTS_SEPARATOR = "*-*-*-*-*"

SYSTEM_MESSAGE_TEMPLATE = (
    """You are an assistant that speaks the English language only.

For answering a user's question use only the information below that is delimited by \""""
    + KNOWLEDGE_BASE_SEPARATOR
    + """\" symbols. We call it a Knowledge Base. The different documents within the Knowledge Base are separated by \""""
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
# pylint: enable=line-too-long

COMBINE_DOCUMENTS_PROMPT: BasePromptTemplate[str] = (
    ChatPromptTemplate.from_messages(
        [
            SystemMessagePromptTemplate.from_template(SYSTEM_MESSAGE_TEMPLATE),
            HumanMessagePromptTemplate.from_template("{question}"),
        ]
    )
    if llm_provider.does_chat_llm_support_system_message()
    else PromptTemplate.from_template(
        SYSTEM_MESSAGE_TEMPLATE
        + """
Here is the user's question that you need to answer:
{question}
"""
    )
)


llm_streamed = llm_provider.create_chat_llm(streaming=True)
llm_buffered = llm_provider.create_chat_llm(streaming=False)


class ConversationRetrievalAssistant(AbstractAssistant):
    """Simple conversational assistant that uses the ConversationChain class to generate responses"""

    RESPONSE_IF_NO_DOCS_FOUND: ClassVar[str] = "Sorry, but I don't have any relevant information in my Knowledge Base."

    def _get_llm_for_condensing(self):
        """Use a buffered LLM for condensing questions chain because it is called before the combine documents chain and its response is not returned to the user directly"""
        return llm_buffered

    def _configure(self, documents_retriever: BaseRetriever, question: str, previous_messages: list[Message]):
        """Configure the chain and its inputs"""
        llm = self._get_llm()
        llm_for_condensing = self._get_llm_for_condensing()

        condense_question_chain = LLMChain(
            llm=llm_for_condensing,
            prompt=CONDENSE_QUESTION_PROMPT,
            verbose=IS_VERBOSE,
        )

        combine_docs_chain = StuffDocumentsChain(
            llm_chain=LLMChain(
                llm=llm,
                prompt=COMBINE_DOCUMENTS_PROMPT,
                verbose=IS_VERBOSE,
            ),
            document_separator=f"\n\n{COMBINE_DOCUMENTS_SEPARATOR}\n\n",
            document_variable_name="context",
            verbose=IS_VERBOSE,
        )

        chain = ConversationalRetrievalChain(
            retriever=documents_retriever,
            question_generator=condense_question_chain,
            combine_docs_chain=combine_docs_chain,
            return_generated_question=False,
            return_source_documents=False,
            max_tokens_limit=self._get_combined_docs_max_tokens(),
            get_chat_history=lambda _: self._compose_history(question, previous_messages),
            response_if_no_docs_found=self.RESPONSE_IF_NO_DOCS_FOUND,
            output_key=OUTPUT_KEY,
            verbose=IS_VERBOSE,
        )

        # we don't need to pass the actual chat history here because it is returned by the get_chat_history function above
        inputs = {"question": question, "chat_history": []}

        return chain, inputs

    def _get_response_chain(self, chain: Chain) -> Chain:
        """Get the response chain from the main chain configured above"""
        return cast(ConversationalRetrievalChain, chain).combine_docs_chain

    def _compose_history(self, question: str, previous_messages: list[Message]) -> str:
        """Get the number of remaining tokens after the inputs are added to the prompt"""
        llm = self._get_llm_for_condensing()
        context_without_history = CONDENSE_QUESTION_PROMPT.format(question=question, chat_history="")
        max_history_tokens = get_number_of_tokens_left(context_without_history, llm)

        return compose_history(llm, previous_messages, max_history_tokens)

    def _get_combined_docs_max_tokens(self) -> int:
        context_without_docs = COMBINE_DOCUMENTS_PROMPT.format(question="", context="")
        max_combined_docs_tokens = get_number_of_tokens_left(context_without_docs, self._get_llm())
        question_tokens = CONDENSE_QUESTION_LENGTH // 4

        return max_combined_docs_tokens - question_tokens


class ConversationRetrievalAssistantBuffered(ConversationRetrievalAssistant):
    """Conversational assistant that uses a buffered LLM"""

    def _get_llm(self):
        return llm_buffered

    async def generate(
        self, documents_retriever: BaseRetriever, question: str, previous_messages: list[Message]
    ) -> str:
        """Generates a buffered response to the given message"""
        return await self._run_chain_buffered(*self._configure(documents_retriever, question, previous_messages))


class ConversationRetrievalAssistantStreamed(ConversationRetrievalAssistant):
    """Conversational assistant that uses a streamed LLM"""

    def _get_llm(self):
        return llm_streamed

    def generate(
        self, documents_retriever: BaseRetriever, question: str, previous_messages: list[Message]
    ) -> AsyncIterable[str]:
        """Generates a streamed response to the given message"""
        return self._run_chain_streamed(*self._configure(documents_retriever, question, previous_messages))
