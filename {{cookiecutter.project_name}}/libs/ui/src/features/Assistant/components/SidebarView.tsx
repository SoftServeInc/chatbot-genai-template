import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Avatar, AvatarIconType, Icon, IconName, AvatarSize } from '../../../components';
import { ChatHeader } from '../../../components/organisms';
import { Button } from '../../../lib/shadcn.ui';
import { AssistantProps } from '../Assistant';
import { Default } from './DefaultView';
import { FULLSCREEN_ROOT } from '../../../constants';

export function SidebarView({ header, styles, ...props }: AssistantProps) {
  const [visible, setVisible] = useState(false);

  const ExtendedProps = {
    ...props,
    header: { title: header?.title || '' },
    styles: { ...styles, header: 'hidden' },
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
          <aside className="animate-appear-from-right flex flex-col w-[27rem] fixed top-0 right-0 bottom-0 shadow-[0_-11px_32px_0_rgba(48,55,70,0.17)]">
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
          </aside>,
          document.getElementsByClassName(FULLSCREEN_ROOT)[0] || document.body,
        )}
    </>
  );
}
