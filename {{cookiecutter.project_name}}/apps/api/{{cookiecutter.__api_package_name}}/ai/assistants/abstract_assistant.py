"""
This module contains the conversational assistant. It is a simple wrapper around the ConversationChain class.
"""

import asyncio
from abc import ABC, abstractmethod
from types import MethodType
from typing import Any, AsyncIterable, Coroutine, Optional

from langchain.callbacks import AsyncIteratorCallbackHandler
from langchain.callbacks.manager import AsyncCallbackManagerForChainRun
from langchain.chains.base import Chain
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate

from ...app.settings import settings
from ..llms import LLM, llm_provider

OUTPUT_KEY = "output"
IS_VERBOSE = settings.LLM.verbose


class AbstractAssistant(ABC):
    """Abstract assistant that can run chain in buffered or streamed mode"""

    @abstractmethod
    def _get_llm(self) -> LLM:
        """Get the LLM to use"""

    async def _run_chain_buffered(self, chain: Chain, inputs: dict[str, Any]) -> str:
        """Generates a buffered response to the given message"""
        output_key = chain.output_keys[0]
        output = (await chain.ainvoke(inputs, return_only_outputs=True, include_run_info=False))[output_key]

        return str(output).strip()

    async def _run_chain_streamed(self, chain: Chain, inputs: dict[str, Any]) -> AsyncIterable[str]:
        """Generates a streamed response to the given message"""
        if not llm_provider.is_streaming_enabled(self._get_llm()):
            raise NotImplementedError("Streaming is not supported by the LLM model")

        callback = AsyncIteratorCallbackHandler()

        async def run_chain() -> dict[str, Any]:
            # The response chain may be a subchain of the main chain
            # Usually, if the main chain is a composition of multiple subchains then the response chain will be the last one
            # For example, in the ConversationRetrievalChain the combine_docs_chain will be the response chain because it is the last chain in the main chain
            response_chain = self._get_response_chain(chain)
            # pylint: disable-next=protected-access
            response_chain_acall = response_chain._acall

            # Override the _acall method of the response chain to add the callback handler to the run manager
            # Unfotunately, we can't add the callback handler to response_chain.callback because those callbacks are not passed downstream, e.g., to the LLM model
            async def response_chain_acall_override(
                _,
                inputs: dict[str, Any],
                run_manager: Optional[AsyncCallbackManagerForChainRun] = None,
            ) -> dict[str, Any]:
                if run_manager is not None:
                    run_manager.inheritable_handlers.append(callback)
                return await response_chain_acall(inputs, run_manager)

            response_chain.__dict__["_acall"] = MethodType(response_chain_acall_override, response_chain)

            try:
                return await chain.ainvoke(inputs, return_only_outputs=True, include_run_info=False)
            finally:
                del response_chain.__dict__["_acall"]
                callback.done.set()

        task = asyncio.create_task(run_chain())
        pending = True

        async for token in callback.aiter():
            if pending:
                pending = False
                token = token.lstrip()  # Trim the whitespaces in the beginning of the response

            yield token

        outputs = await task
        output_key = chain.output_keys[0]

        # If no response has been streamed, there still may be a generated output
        # for example, if the LLM model is not streamable or if the response has been generated prematurely
        # like in the ConversationRetrievalChain when no documents are found and the response is generated immediately without passing through the LLM model
        if pending and (output_key in outputs):
            yield str(outputs[output_key]).strip()

    def _get_response_chain(self, chain: Chain) -> Chain:
        """Get the response chain from the main chain, i.e., the chain that generates the final response for the user"""
        return chain


class AbstractBasicAssistant(AbstractAssistant):
    """Simple assistant that uses the LLMChain class to generate buffered or streamed responses"""

    def _run_buffered(self, inputs: dict[str, Any]) -> Coroutine[Any, Any, str]:
        return self._run_chain_buffered(self._get_chain(), self._with_stop_sequence(inputs))

    def _run_streamed(self, inputs: dict[str, Any]) -> AsyncIterable[str]:
        return self._run_chain_streamed(self._get_chain(), self._with_stop_sequence(inputs))

    def _get_chain(self) -> Chain:
        """Creates the chain - by default, it is a simple LLMChain but can be overridden to use a different chain in a subclass"""
        return LLMChain(
            llm=self._get_llm(),
            prompt=self._get_prompt_template(),
            output_key=OUTPUT_KEY,
            verbose=IS_VERBOSE,
        )

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
