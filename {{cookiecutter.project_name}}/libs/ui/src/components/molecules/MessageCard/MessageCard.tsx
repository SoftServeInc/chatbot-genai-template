import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { MessageType } from '../../../types';

interface MessageCardProps {
  type?: MessageType;
  className?: string;
  children: ReactNode | ReactNode[];
}

export function MessageCard({ type, children, className }: MessageCardProps) {
  return <li className={`${type} flex flex-row mb-4 text-black ${className}`}>{children}</li>;
}

interface MessageCardContentProps {
  className?: string;
  children: ReactNode | ReactNode[];
}

MessageCard.Content = function Content({ children, className = '' }: MessageCardContentProps) {
  return (
    <div
      className={cn(
        '@xs/chat:py-2 @xs/chat:px-[0.87rem] @xs/chat:text-sm @xs/chat:tracking-tightest',
        '@2xl/chat:py-3 @2xl/chat:px-[1.19rem] @2xl/chat:text-[0.9375rem]/6 @2xl/chat:tracking-normal',
        'min-h-[3rem] min-w-[3.6875rem] max-w-[46.25rem] mb-[0.31rem] rounded-xl gap-4',
        className,
      )}
    >
      {children}
    </div>
  );
};

interface MessageCardBodyProps {
  className?: string;
  children: ReactNode | ReactNode[];
}

MessageCard.Body = function Body({ children, className = '' }: MessageCardBodyProps) {
  return (
    <div
      className={cn(
        '@xs/chat:min-h-[6.5625rem]',
        '@2xl/chat:min-h-[7.8125rem]',
        'flex flex-col',
        className,
      )}
    >
      {children}
    </div>
  );
};
