import { StoreApi } from 'zustand/vanilla';
import { create } from '../../api/chats';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async () => {
  try {
    store.setState({ isCreating: true });
    const response = await create('New Chat');

    if (response) {
      const chats = [response, ...store.getState().chats];
      store.setState({ ...response, chats, isCreating: false });
      return response;
    }

    store.setState({ isCreating: false });
    return null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to create new chat:', error);
    store.setState({ isCreating: false });
    return null;
  }
};
