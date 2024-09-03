import { StoreApi } from 'zustand/vanilla';
import { MessageAuthor } from '../../types';
import { generateTitle } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async () => {
  try {
    const assistantMessages = store
      .getState()
      .messages.filter((message) => message.role === MessageAuthor.assistant);

    if (assistantMessages.length !== 2) {
      return;
    }

    store.setState({ isUpdating: true });

    const chatId = store.getState().id;
    if (chatId) {
      const response = await generateTitle(chatId);
      if (response) {
        const chats = store
          .getState()
          .chats.map((chat) => (chat.id === chatId ? { ...chat, title: response } : chat));
        store.setState({ chats, title: response, isUpdating: false });
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate chat title:', error);
    store.setState({ isUpdating: false });
  }
};
