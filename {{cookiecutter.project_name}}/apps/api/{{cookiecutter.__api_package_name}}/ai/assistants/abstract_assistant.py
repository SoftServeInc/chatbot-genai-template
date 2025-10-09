"""
This module contains the conversational assistant. It is a simple wrapper around the ConversationChain class.
"""

import asyncio
from abc import ABC, abstractmethod
from typing import Any, AsyncIterable, cast, Coroutine

from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import Runnable, RunnableConfig

from ...app.settings import settings
from ..llms import LLM, llm_provider

OUTPUT_KEY = "output"
IS_VERBOSE = settings.LLM.verbose


class AbstractAssistant(ABC):
    """Abstract assistant that can run chain in buffered or streamed mode"""

    @abstractmethod
    def _get_llm(self) -> LLM:
        """Get the LLM to use"""

    def _runnable_config(self, **kwargs) -> RunnableConfig:
        """Get the runnable config to use with the chain.invoke or chain.ainvoke methods"""
        runnable_dict: dict[str, Any] = {"verbose": IS_VERBOSE}

        # Note: by adding kwargs parameters they will be added to the runnable config, overriding any existing parameters.
        #  That option is used in _run_chain_streamed to add the callbacks parameter.
        if kwargs:
            runnable_dict.update(kwargs)

        return cast(RunnableConfig, runnable_dict)

    async def _run_chain_buffered(self, chain: Runnable, inputs: dict[str, Any]) -> str:
        """Generates a buffered response to the given message"""
        output = await chain.ainvoke(inputs, conf=self._runnable_config())

        return output

    async def _run_chain_streamed(self, chain: Runnable, inputs: dict[str, Any]) -> AsyncIterable[str]:
        """Generates a streamed response to the given message"""
        if not llm_provider.is_streaming_enabled(self._get_llm()):
            raise NotImplementedError("Streaming is not supported by the LLM model")

        callback = AsyncIteratorCallbackHandler()

        task = asyncio.create_task(
            chain.ainvoke(
                inputs,
                config=self._runnable_config(callbacks=[callback]),
            )
        )
        pending = True

        async for token in callback.aiter():
            if pending:
                pending = False
                token = token.lstrip()  # Trim the whitespaces in the beginning of the response

            yield token

        outputs = await task

        # If no response has been streamed, there still may be a generated output
        # for example, if the LLM model is not streamable or if the response has been generated prematurely
        # like in the ConversationRetrievalChain when no documents are found and the response is generated immediately without passing through the LLM model
        if pending and outputs:
            yield outputs

    def _get_response_chain(self, chain: Runnable) -> Runnable:
        """Get the response chain from the main chain, i.e., the chain that generates the final response for the user"""
        return chain


class AbstractBasicAssistant(AbstractAssistant):
    """Simple assistant that uses the LangChain Express Language chain to generate buffered or streamed responses"""

    def _run_buffered(self, inputs: dict[str, Any]) -> Coroutine[Any, Any, str]:
        return self._run_chain_buffered(self._get_chain(), self._with_stop_sequence(inputs))

    def _run_streamed(self, inputs: dict[str, Any]) -> AsyncIterable[str]:
        return self._run_chain_streamed(self._get_chain(), self._with_stop_sequence(inputs))

    def _get_chain(self) -> Runnable:
        """Creates the chain - by default, it is a simple pipe of Runnables but can be overridden to use a different pipe in a subclass"""
        llm = self._get_llm()
        prompt = self._get_prompt_template()
        # StrOutputParser is used to ensure the output is a string
        return prompt | llm | StrOutputParser()

    @abstractmethod
    def _get_prompt_template(self) -> PromptTemplate:
        """Get the prompt template to use"""

    def _with_stop_sequence(self, inputs: dict[str, Any]) -> dict[str, Any]:
        """Prepares the inputs for the chain"""
        stop = self._get_stop_sequence()

        if stop:
            inputs["stop"] = stop if isinstance(stop, list) else [stop]

        return inputs

    def _get_stop_sequence(self) -> str | list[str]:
        """Get the stop sequence to use"""
        return ""
