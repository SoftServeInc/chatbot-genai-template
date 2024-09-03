import { StoreApi } from 'zustand/vanilla';
import { remove } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async (chatId: string) => {
  try {
    const id = chatId || store.getState().id || '';
    await remove(id);
    store.setState({
      chats: store.getState().chats.filter((chat) => chat.id !== id),
      id: null,
      created_at: null,
      modified_at: null,
      user_id: null,
      title: 'New Chat',
      messages: [],
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to remove chat:', error);
  }
};
