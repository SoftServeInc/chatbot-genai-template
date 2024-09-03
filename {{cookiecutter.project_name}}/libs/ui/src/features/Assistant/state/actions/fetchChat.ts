import { StoreApi } from 'zustand/vanilla';
import { getOne } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async (id: string) => {
  try {
    store.setState({ isLoading: true });
    const response = await getOne(id);
    if (response) {
      const messages = response.messages ? response.messages.reverse() : [];
      store.setState({ ...response, messages, isLoading: false });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to load chat data:', error);
    store.setState({ isLoading: false });
  }
};
