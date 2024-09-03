import { StoreApi } from 'zustand/vanilla';
import { Message, MessageRating } from '../../../../types';
import { addFeedback } from '../../api/messages';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) =>
  async (feedback: MessageRating, messageId: string) => {
    try {
      store.setState({ isUpdating: true });
      const response = await addFeedback(messageId, feedback);
      if (response) {
        const messages: Message[] = store
          .getState()
          .messages.map((message) =>
            message.id === messageId ? { ...message, feedback_rating: response.rating } : message,
          );
        store.setState({ messages, isUpdating: false });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to rate message:', error);
      store.setState({ isUpdating: false });
    }
  };
