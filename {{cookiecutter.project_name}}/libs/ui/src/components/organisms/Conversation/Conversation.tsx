import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Capabilities, ScrollAnchor } from '../../molecules';
import { EmptyState } from './EmptyState';

interface Capability {
  question: string;
}

interface ConversationProps {
  children?: ReactNode | ReactNode[];
  isLoading?: boolean;
  className?: string;
  capabilities?: Capability[];
  onCapabilityClick?: (prompt: string) => void;
}

export function Conversation({
  children,
  capabilities,
  className,
  isLoading,
  onCapabilityClick,
}: ConversationProps) {
  if (!children) {
    return (
      <EmptyState>
        {capabilities && <Capabilities data={capabilities} onCapabilityClick={onCapabilityClick} />}
      </EmptyState>
    );
  }
  return (
    <div
      className={cn(
        'bg-blue-gray-25 flex-1 overflow-y-auto h-0',
        '@xs/chat:px-[0.88rem] @xs/chat:pt-4',
        '@2xl/chat:px-[1.87rem] @2xl/chat:pt-4',
        className,
      )}
    >
      <ul className="mx-auto flex flex-col">{children}</ul>
      <ScrollAnchor trackVisibility={isLoading} />
    </div>
  );
}
