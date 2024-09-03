import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { ChatActions, ChatAction } from '../../molecules/ChatActions';

interface ChatHeaderProps {
  className?: string;
  children?: ReactNode | ReactNode[];
  rounded?: number;
  title: string;
  actions?: ChatAction[];
  parentId: string;
}
export function ChatHeader({
  className,
  parentId,
  children,
  rounded,
  title,
  actions,
}: ChatHeaderProps) {
  return (
    <header
      className={`flex justify-between bg-blue-gray-25 p-3 border-b ${className || ''} ${
        rounded ? `rounded-[${rounded}rem]` : ''
      }`}
    >
      <h5 className="tracking-[-.045em] text-black">{title}</h5>
      <div className="flex items-center gap-3">
        {actions && <ChatActions parentId={parentId} actions={actions} className="w-10 h-10 p-2" />}
        {children}
      </div>
    </header>
  );
}

interface ChatProps {
  id: string;
  header?: {
    title: string;
    className?: string;
  };
  children: ReactNode | ReactNode[];
  className?: string;
  rounded?: number;
  actions?: ChatAction[];
}

export function Chat({ id, header, rounded = 0, actions, children, className }: ChatProps) {
  return (
    <section
      className={cn(
        '@container/chat mx-auto flex flex-1 flex-col justify-items-stretch',
        'min-w-[23.4375rem] max-w-[58.74rem] min-h-0',
        `rounded-[${rounded}rem]`,
        className,
      )}
    >
      {header && header.title ? (
        <ChatHeader
          parentId={id}
          className={header.className}
          title={header.title}
          actions={actions}
          rounded={rounded}
        />
      ) : null}
      {children}
    </section>
  );
}

interface ChatFooterProps {
  children: ReactNode | ReactNode[];
  className?: string;
}
export function ChatFooter({ children, className }: ChatFooterProps) {
  return (
    <footer
      className={cn(
        '@xs/chat:px-[0.88rem] @xs/chat:pb-[0.88rem] @xs/chat:pt-4',
        '@2xl/chat:px-[1.88rem] @2xl/chat:pb-[1.56rem] @2xl/chat:pt-6',
        'relative bg-blue-gray-25',
        className,
      )}
    >
      {children}
    </footer>
  );
}
