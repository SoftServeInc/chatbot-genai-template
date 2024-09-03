"""
Wrapper classes for the Langchain Bedrock models.
This is a workaround to remove the stop sequence for providers that do not support stop words.
For example 'meta' provider and its LLaMA model.

It also retries the stream and generate calls on EventStreamError exception
which happen from time to time for InvokeModelWithResponseStream Bedrock operation
with the message "The system encountered an unexpected error during processing. Try your request again."
"""

from time import sleep
from typing import Any, Callable, Optional, TypeVar

from botocore.exceptions import EventStreamError
from langchain.schema import BaseMessage
from langchain_community.chat_models.bedrock import BedrockChat as BaseBedrockChat
from langchain_community.llms.bedrock import Bedrock as BaseBedrock
from langchain_community.llms.bedrock import BedrockBase as _BedrockBaseModel
from langchain_core.callbacks import CallbackManagerForLLMRun

T = TypeVar("T")


# pylint: disable=too-many-ancestors
class ChatBedrock(BaseBedrockChat):
    """Wrapper class for the Langchain Bedrock chat model that removes the stop sequence for LLMs that do not support stop words and retries on EventStreamError exception"""

    def _stream(
        self,
        messages: list[BaseMessage],
        stop: Optional[list[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ):
        super_stream = super()._stream
        return _retry_on_stream_error(
            lambda: super_stream(messages, _get_stop_sequences(self, stop), run_manager, **kwargs)
        )

    def _generate(
        self,
        messages: list[BaseMessage],
        stop: Optional[list[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ):
        super_generate = super()._generate
        return _retry_on_stream_error(
            lambda: super_generate(messages, _get_stop_sequences(self, stop), run_manager, **kwargs)
        )


class Bedrock(BaseBedrock):
    """Wrapper class for the Langchain Bedrock completion model that removes the stop sequence for LLMs that do not support stop words and retries on EventStreamError exception"""

    def _stream(
        self,
        prompt: str,
        stop: Optional[list[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ):
        super_stream = super()._stream
        return _retry_on_stream_error(
            lambda: super_stream(prompt, _get_stop_sequences(self, stop), run_manager, **kwargs)
        )

    def _generate(
        self,
        prompts: list[str],
        stop: Optional[list[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ):
        super_generate = super()._generate
        return _retry_on_stream_error(
            lambda: super_generate(prompts, _get_stop_sequences(self, stop), run_manager, **kwargs)
        )


def _retry_on_stream_error(func: Callable[[], T]) -> T:
    max_attempts = 5

    for attempt in range(max_attempts):
        try:
            return func()
        except EventStreamError as e:
            code = e.response.get("Error", {}).get("Code", "")
            if code in ("modelStreamErrorException", "throttlingException") and attempt < max_attempts - 1:
                sleep(0.5)
                continue
            raise

    return func()


def _get_stop_sequences(llm: _BedrockBaseModel, stop: Optional[list[str]]) -> Optional[list[str]]:
    """Get the stop sequences for the given LLM model or None if the model does not support stop sequences"""
    # pylint: disable-next=protected-access
    return None if llm._get_provider() not in llm.provider_stop_sequence_key_name_map else stop
