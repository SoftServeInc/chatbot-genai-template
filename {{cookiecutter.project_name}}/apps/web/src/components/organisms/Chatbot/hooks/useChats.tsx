import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { useChatbotStore, ChatbotStoreState } from '../state/store';

export function useChats(load: boolean) {
  const [fetchChats, fetchChat, createNewChat, removeChat, updateChatTitle, chats] =
    useChatbotStore(
      (state: ChatbotStoreState) => [
        state.fetchChats,
        state.fetchChat,
        state.createNewChat,
        state.removeChat,
        state.updateChatTitle,
        state.chats,
      ],
      shallow,
    );

  useEffect(() => {
    if (load) {
      fetchChats();
    }
  }, [fetchChats, load]);

  return {
    chats,
    onCreate: createNewChat,
    onRemove: removeChat,
    onRename: updateChatTitle,
    onFetchById: fetchChat,
  };
}
