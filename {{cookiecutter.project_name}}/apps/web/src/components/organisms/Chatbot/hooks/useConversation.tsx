import { useRef, useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useChatbotStore, ChatbotStoreState } from '../state/store';

export function useConversation() {
  const controllerRef = useRef<AbortController | null>(null);
  const [
    id,
    title,
    messages,
    isAssistantReplying,
    streaming,
    fetchChat,
    resetToDefaults,
    sendMessage,
    streamMessage,
    rateMessage,
  ] = useChatbotStore(
    (state: ChatbotStoreState) => [
      state.id,
      state.title,
      state.messages,
      state.isAssistantReplying,
      state.streaming,
      state.fetchChat,
      state.resetToDefaults,
      state.sendMessage,
      state.streamMessage,
      state.rateMessage,
    ],
    shallow,
  );

  const capabilities = [
    { question: '<b>What</b> is the speed of light?' },
    { question: '<b>Why</b> the sky is blue?' },
    { question: '<b>How</b> do airplanes fly?' },
    { question: '<b>Who</b> is inventor of The World Wide Web?' },
    { question: '<b>When</b> is the largest day?' },
  ];

  useEffect(() => {
    controllerRef.current = new AbortController();
    return () => {
      controllerRef.current?.abort();
      resetToDefaults();
    };
  }, [resetToDefaults]);

  const handleStartStreaming = (prompt: string) => {
    if (controllerRef.current) {
      streamMessage(prompt, controllerRef.current);
    }
  };

  const handleStopStreaming = () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
  };

  const handleSendMessage = (prompt: string) => sendMessage(prompt);

  return {
    id,
    title,
    capabilities,
    messages,
    streaming,
    isLoading: isAssistantReplying,
    onFetchChat: fetchChat,
    onSendMessage: handleSendMessage,
    onStartStreaming: handleStartStreaming,
    onStopStreaming: handleStopStreaming,
    onAddFeedback: rateMessage,
    onResetToDefaults: resetToDefaults,
  };
}
