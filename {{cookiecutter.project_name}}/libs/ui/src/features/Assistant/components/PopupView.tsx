import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Avatar, AvatarIconType, Icon, IconName, AvatarSize } from '../../../components/atoms';
import { AvailableChats, ChatHeader } from '../../../components/organisms';
import { Button } from '../../../lib/shadcn.ui';
import { AssistantProps } from '../Assistant';
import { Default } from './DefaultView';
import { useChats } from '../hooks';
import { FULLSCREEN_ROOT } from '../../../constants';

export function PopupView({ header, chatsPanel, styles, ...props }: AssistantProps) {
  const { chats, onCreate, onRemove, onRename, onFetchById } = useChats(!chatsPanel);
  const [visible, setVisible] = useState(false);
  const ExtendedProps = {
    ...props,
    header: { title: header?.title || '' },
    styles: { ...styles, header: 'hidden' },
  };

  const ChatsPanelConfig = chatsPanel || {
    selected: props.chat?.id || '',
    chats,
    actions: {
      onSelect: onFetchById,
      onCreate,
      onRename,
      onRemove,
    },
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setVisible(true)}
        className={`w-[3.4375rem] h-[3.4375rem] rounded-full ${styles?.fabButton}`}
      >
        <Avatar size={AvatarSize.lg} type={AvatarIconType.icon} />
      </Button>
      {visible &&
        createPortal(
          <div className="animate-appear-from-bottom flex backdrop-blur bg-[rgba(197,204,214,0.75)] dark:bg-[rgba(13,42,86,0.75)] fixed top-0 inset-x-0 pt-[3.75rem] bottom-0 shadow-[0_-11px_32px_0_rgba(48,55,70,0.17)]">
            <div className="rounded-t-xl bg-blue-gray-25 overflow-clip flex flex-1">
              <AvailableChats {...ChatsPanelConfig} className={styles?.chatsPanel} />
              <div className="flex flex-col flex-1">
                <ChatHeader
                  parentId={props.chat?.id || ''}
                  title={header?.title || ''}
                  className={styles?.header}
                >
                  <Button size="icon" variant="ghost" onClick={() => setVisible(false)}>
                    <Icon name={IconName.close} />
                  </Button>
                </ChatHeader>
                <Default {...ExtendedProps} />
              </div>
            </div>
          </div>,
          document.getElementsByClassName(FULLSCREEN_ROOT)[0] || document.body,
        )}
    </>
  );
}
