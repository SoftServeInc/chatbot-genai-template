import { v4 as uuid } from 'uuid';
import { StoreApi } from 'zustand/vanilla';
import { Message, MessageAuthor, MessageType } from '../../types';
import { streamMessage } from '../../api/conversation';
import { ChatbotStoreState } from '../store';

export default (store: StoreApi<ChatbotStoreState>) =>
  async (message: string, controller: AbortController) => {
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
      store.setState({
        messages: [...conversation],
      });

      const updateConversation = (messages: Message[]) => {
        const reply = messages.find(({ role }) => role === 'assistant');
        if (!reply) {
          return;
        }
        if (!reply.segments.length) {
          reply.segments.push({ type: MessageType.text, content: '' });
        }

        const replyIdx = conversation.findIndex(({ id }) => id === reply.id);
        if (replyIdx < 0) {
          conversation.push(reply);
        } else {
          conversation[replyIdx].segments[0].content = reply.segments
            .map(({ type, content }) => (type === 'text' ? content : ''))
            .join('');
        }

        store.setState({
          messages: [...conversation],
          isAssistantReplying: reply.in_progress,
          streaming: reply.in_progress ? reply.id : '',
        });

        if (!reply.in_progress) {
          // Use last message as details for selected chat
          const chats = store.getState().chats.map((chat) => {
            if (chat.id === chatId) {
              return { ...chat, details: conversation[replyIdx].segments[0].content || '' };
            }
            return chat;
          });
          store.setState({ chats });
          // Update chat title by LLM, after 2 replis form Assistant
          store.getState().generateChatTitle();
        }
      };

      streamMessage(chatId, message, controller, updateConversation).then(updateConversation);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to stream message:', error);
      store.setState({ isAssistantReplying: false });
    }
  };
