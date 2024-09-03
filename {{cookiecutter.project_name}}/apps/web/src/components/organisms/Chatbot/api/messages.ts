import { api } from 'ui/src/api/client/index';
import { Message, MessageRating } from '../types/Message';

export async function getOne(messageId: string): Promise<Message | null> {
  try {
    const { data } = await api.get(`/messages/${messageId}`);
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}

export async function addFeedback(
  messageId: string,
  rating: MessageRating,
): Promise<MessageRating | null> {
  try {
    const { data } = await api.post(`/messages/${messageId}/feedback`, { data: rating });
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}
