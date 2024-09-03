import { Chats, Chat } from '../../../types/Chat';
import { api } from '../../../api/client/index';

export async function create(title = 'New Chat'): Promise<Chat | null> {
  try {
    const { data } = await api.post('/chats', { data: { title } });
    const response = data.data;

    return response;
  } catch (error) {
    return null;
  }
}

export async function getOne(chatId: string): Promise<Chat | null> {
  try {
    const { data } = await api.get(`/chats/${chatId}?include=messages`);
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}

export async function getAll(): Promise<Chats | null> {
  try {
    const { data } = await api.get(`/chats?include=messages`);
    const response = data;
    return response;
  } catch (error) {
    return null;
  }
}

export async function generateTitle(chatId: string): Promise<string | null> {
  try {
    const { data } = await api.post(`/chats/${chatId}/generate-title`);
    const response = data.data;
    return response.title;
  } catch (error) {
    return null;
  }
}

export async function updateTitle(title: string, chatId: string): Promise<Chat | null> {
  try {
    const { data } = await api.patch(`/chats/${chatId}`, { data: { title } });
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}

export async function remove(chatId: string): Promise<string | null> {
  try {
    const response = await api.delete(`/chats/${chatId}`);
    return response.statusText;
  } catch (error) {
    return null;
  }
}
