import { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ZUSTAND_DEVTOOLS_ENABLED } from '../../../constants';
import { createSelectors } from '../../../utils';
import { Chat } from '../../../types/Chat';
import { Message, MessageRating } from '../../../types/Message';

import fetchChat from './actions/fetchChat';
import fetchChats from './actions/fetchChats';
import createNewChat from './actions/createNewChat';
import removeChat from './actions/removeChat';
import generateChatTitle from './actions/generateChatTitle';
import updateChatTitle from './actions/updateChatTitle';
import sendMessage from './actions/sendMessage';
import streamMessage from './actions/streamMessage';
import rateMessage from './actions/rateMessage';

export interface ChatbotStoreState {
  chats: Chat[];
  id: string | null;
  created_at: string | null;
  modified_at: string | null;
  user_id: string | null;
  title: string;
  messages: Message[];
  isAssistantReplying: boolean;
  streaming: string;
  isUpdating: boolean;
  isCreating: boolean;
  isLoading: boolean;

  fetchChats: () => void;
  fetchChat: (id: string) => void;
  createNewChat: () => Promise<Chat | null>;
  removeChat: (id: string) => void;
  generateChatTitle: () => void;
  updateChatTitle: (title: string, id?: string) => void;
  sendMessage: (messageContent: string) => void;
  resetToDefaults: () => void;
  streamMessage: (propmt: string, controller: AbortController) => Promise<void>;
  rateMessage: (feedback: MessageRating, messageId: string) => void;
}

export const defaultState = {
  chats: [],
  id: null,
  created_at: null,
  modified_at: null,
  user_id: null,
  title: 'New Chat',
  messages: [],
  isAssistantReplying: false,
  streaming: '',
  isUpdating: false,
  isCreating: false,
  isLoading: false,
};

const createChatbotSlice: StateCreator<
  ChatbotStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
  ]
> = (set, get, api) => ({
  ...defaultState,
  fetchChats: fetchChats(api),
  fetchChat: fetchChat(api),
  createNewChat: createNewChat(api),
  removeChat: removeChat(api),
  generateChatTitle: generateChatTitle(api),
  updateChatTitle: updateChatTitle(api),
  sendMessage: sendMessage(api),
  resetToDefaults: () => set({ ...defaultState }),
  streamMessage: streamMessage(api),
  rateMessage: rateMessage(api),
});

export const useChatbotStore = createSelectors(
  createWithEqualityFn<ChatbotStoreState>()(
    immer(
      devtools(subscribeWithSelector(createChatbotSlice), {
        enabled: ZUSTAND_DEVTOOLS_ENABLED,
        name: 'chatbot_store',
      }),
    ),
  ),
);
