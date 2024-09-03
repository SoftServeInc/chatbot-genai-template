/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssistantProps } from './Assistant';
import { MessageAuthor, MessageRating, MessageType } from '../../types';

export const assistantMocks: AssistantProps = {
  reset: {
    enabled: true,
    onAfterReset: () => {},
  },
  header: {
    title: 'title',
    actions: [],
    onClose: () => {},
  },
  chat: {
    id: 'chat-id',
    capabilities: [],
    messages: [
      {
        chat_id: 'chat-id',
        in_progress: true,
        role: MessageAuthor.assistant,
        segments: [
          {
            type: MessageType.text,
            content: 'message content',
          },
        ],
        feedback_rating: 0,
        created_at: '2024-02-12T11:25:26.866069+00:00',
        modified_at: '2024-02-12T11:25:26.866069+00:00',
        id: 'message-id',
      },
    ],
    isLoading: false,
    activeMessageId: 'activeMessageId',
    rounded: 4,
  },
  chatsPanel: {
    className: 'className',
    selected: 'selected',
    chats: [
      {
        id: 'chat-id',
        created_at: '2024-02-12T11:25:26.866069+00:00',
        modified_at: '2024-02-12T11:25:26.866069+00:00',
        title: 'title',
        user_id: 'user-id',
        messages: [
          {
            chat_id: 'chat-id',
            in_progress: true,
            role: MessageAuthor.assistant,
            segments: [
              {
                type: MessageType.text,
                content: 'content',
              },
            ],
            feedback_rating: 1,
            created_at: '2024-02-12T11:25:26.866069+00:00',
            modified_at: '2024-02-12T11:25:26.866069+00:00',
            id: 'message-id',
          },
        ],
      },
    ],
    actions: {
      onSelect: (id: string) => {},
      onCreate: () => {},
      onRemove: (id: string) => {},
      onRename: (title: string, id: string) => {},
    },
  },
  styles: {
    chatsPanel: 'chatsPanel',
    header: 'header',
    chat: 'chat',
    fabButton: 'fabButton',
  },
  actions: {
    onSubmit: (message: string) => {},
    onStopStreaming: () => {},
    onAddFeedback: (feedback: MessageRating, messageId: string) => {},
  },
};
