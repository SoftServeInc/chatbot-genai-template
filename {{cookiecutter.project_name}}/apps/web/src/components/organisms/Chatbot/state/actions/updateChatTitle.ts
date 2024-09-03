import { StoreApi } from 'zustand/vanilla';
import { updateTitle } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async (title: string, id?: string) => {
  try {
    store.setState({ isUpdating: true });

    const chatId = store.getState().id || id;
    const response = await updateTitle(title, chatId || '');
    if (response) {
      const chats = store
        .getState()
        .chats.map((chat) =>
          chat.id === response.id
            ? { ...chat, title: response.title, modified_at: response.modified_at }
            : chat,
        );
      store.setState({ chats, title, isUpdating: false });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to update chat title:', error);
    store.setState({ isUpdating: false });
  }
};
