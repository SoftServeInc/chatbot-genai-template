import { useEffect } from 'react';
import { ChatAction } from '../../components/molecules';
import { Capability, Message, MessageRating } from '../../types';
import { Default, SidebarView, PopupView } from './components';
import { AvailableChatsProps } from '../../components/organisms/AvailableChats';
import { useConversation } from './hooks';

export interface AssistantProps {
  variant?: 'popup' | 'sidebar' | 'default';
  reset?: {
    enabled?: boolean;
    onAfterReset?: () => void;
  };
  header?: {
    title: string;
    actions?: ChatAction[];
    onClose?: () => void;
  };
  chat?: {
    id: string;
    capabilities: Capability[];
    messages: Message[];
    isLoading: boolean;
    activeMessageId: string;
    rounded?: number;
    icons?: {
      user: string;
      assistant?: string;
    };
  };
  chatsPanel?: AvailableChatsProps;
  styles?: {
    chatsPanel?: string;
    header?: string;
    chat?: string;
    fabButton?: string;
  };
  actions?: {
    onSubmit: (message: string) => void;
    onStopStreaming: () => void;
    onAddFeedback: (feedback: MessageRating, messageId: string) => void;
  };
}

const AssistantVariants = new Map();
AssistantVariants.set('default', Default);
AssistantVariants.set('sidebar', SidebarView);
AssistantVariants.set('popup', PopupView);

export function Assistant({
  variant = 'default',
  reset = {
    enabled: false,
  },
  styles = {
    chatsPanel: '',
    header: '',
    chat: '',
    fabButton: '',
  },
  ...props
}: AssistantProps) {
  const Component = AssistantVariants.get(variant);

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
    if (reset && reset.enabled) {
      onResetToDefaults();

      if (reset?.onAfterReset) {
        reset?.onAfterReset();
      }
    }
  }, [reset, onResetToDefaults]);

  const ChatHeaderConfig = {
    title,
  };

  const ChatConfig = {
    id,
    capabilities,
    messages,
    isLoading,
    activeMessageId: streaming,
  };

  const AssistantActions = {
    onSubmit: onStartStreaming,
    onStopStreaming,
    onAddFeedback,
  };

  const config = {
    ...props,
    header: props.header || ChatHeaderConfig,
    chat: props.chat || ChatConfig,
    actions: props.actions || AssistantActions,
    styles,
  };

  return <Component {...config} />;
}
