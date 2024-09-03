import { StoreApi } from 'zustand/vanilla';
import { getAll } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async () => {
  try {
    store.setState({ isLoading: true });
    const response = await getAll();
    if (response) {
      const chats = response.data.map((chat) => {
        if (chat.messages && chat.messages.length) {
          return { ...chat, details: chat.messages[0].segments[0].content || '' };
        }
        return chat;
      });
      store.setState({ chats, isLoading: false });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load chats data:', error);
    store.setState({ isLoading: false });
  }
};
