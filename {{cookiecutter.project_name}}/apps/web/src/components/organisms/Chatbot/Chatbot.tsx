import { useEffect } from 'react';
import { Assistant } from 'ui';
import { useAuth } from '@/hooks';
import { useChats, useConversation } from './hooks';

export interface ChatbotProps {
  variant?: 'popup' | 'sidebar';
  header?: {
    title?: string;
    className?: string;
  };
  chat?: {
    rounded?: number;
    className?: string;
  };
  fabButton?: {
    className?: string;
  };
  withChats?: boolean;
  reset?: boolean;
  onAfterReset?: () => void;
}

export function Chatbot({
  reset = false,
  variant,
  header,
  chat,
  fabButton,
  withChats = false,
  onAfterReset,
}: ChatbotProps) {
  const { userProfile } = useAuth();
  const { chats, onCreate, onRemove, onRename, onFetchById } = useChats(withChats);
  const {
    id,
    title,
    capabilities,
    messages,
    onStartStreaming,
    onStopStreaming,
    onAddFeedback,
    onResetToDefaults,
    isLoading,
    streaming,
  } = useConversation();

  useEffect(() => {
    if (reset) {
      onResetToDefaults();

      if (onAfterReset) {
        onAfterReset();
      }
    }
  }, [reset, onResetToDefaults, onAfterReset]);
  const chatId = id || '';

  const config = {
    variant,
    chat: {
      id: chatId,
      capabilities,
      messages,
      isLoading,
      activeMessageId: streaming,
      rounded: chat?.rounded,
      icons: {
        user: userProfile?.avatar_url || '',
      },
    },
    fabButton,
    styles: {
      chatsPanel: withChats ? 'border-r' : '',
      header: header?.className || '',
      chat: chat?.className || '',
      fabButton: fabButton?.className || '',
    },
    actions: {
      onSubmit: onStartStreaming,
      onStopStreaming,
      onAddFeedback,
    },
  };

  if (header) {
    Object.assign(config, {
      header: {
        title: header?.title || title,
        className: header?.className || '',
      },
    });
  }

  if (withChats) {
    Object.assign(config, {
      chatsPanel: {
        selected: chatId,
        chats,
        actions: {
          onSelect: onFetchById,
          onCreate,
          onRename,
          onRemove,
        },
      },
    });
  }

  return <Assistant {...config} />;
}
