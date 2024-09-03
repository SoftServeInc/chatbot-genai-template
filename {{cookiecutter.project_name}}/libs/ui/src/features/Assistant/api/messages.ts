import { Message, MessageRating } from '../../../types/Message';
import { api } from '../../../api/client/index';

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
    const { data } = await api.post(`/messages/${messageId}/rating`, { data: rating });
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}
