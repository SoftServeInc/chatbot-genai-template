import { v4 as uuid } from 'uuid';
import { StoreApi } from 'zustand/vanilla';
import { Message, MessageAuthor, MessageType } from '../../../../types';
import { sendMessage } from '../../api/conversation';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) => async (message: string) => {
  try {
    let chatId = store.getState().id;
    if (!chatId) {
      const chat = await store.getState().createNewChat();
      if (!chat?.id) {
        return;
      }

      chatId = chat?.id;
    }
    const conversation = [...store.getState().messages];
    const userMessage: Message = {
      id: uuid(),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      role: MessageAuthor.user,
      segments: [
        {
          type: MessageType.text,
          content: message,
        },
      ],
    };
    conversation.push(userMessage);

    const respondsMessage: Message = {
      id: uuid(),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString(),
      role: MessageAuthor.assistant,
      segments: [
        {
          type: MessageType.responds,
          content: '',
        },
      ],
    };

    store.setState({
      messages: [...conversation, respondsMessage],
      isAssistantReplying: true,
    });

    const response = await sendMessage(chatId, message);
    const reply = response[response.length - 1];
    if (!reply.segments.length) {
      reply.segments.push({ type: MessageType.text, content: '' });
    }

    store.setState({
      messages: [...conversation, reply],
      isAssistantReplying: false,
    });

    // Use last message as details for selected chat
    const chats = store.getState().chats.map((chat) => {
      if (chat.id === chatId) {
        return { ...chat, details: reply.segments[0].content || '' };
      }
      return chat;
    });
    store.setState({ chats });
    // Update chat title by LLM, after 2 replis form Assistant
    store.getState().generateChatTitle();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to send message:', error);
    store.setState({ isAssistantReplying: false });
  }
};
