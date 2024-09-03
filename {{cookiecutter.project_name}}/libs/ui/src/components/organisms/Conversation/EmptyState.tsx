import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Icon, IconName } from '../..';

interface EmptyStateProps {
  icon?: IconName;
  caption?: string;
  children?: ReactNode | ReactNode[];
  className?: string;
}
export function EmptyState({
  icon = IconName.bot,
  caption = 'I can help you with lots of things',
  children,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        '@xs/chat:p-[0.88rem]',
        '@2xl/chat:p-1.94rem',
        'bg-blue-gray-25',
        'overflow-y-auto flex-1 h-0',
        className,
      )}
    >
      <figure
        className={cn(
          '@xs/chat:mb-[1.62rem]',
          '@2xl/chat:mb-11',
          'flex flex-col items-center mt-[10%]',
        )}
      >
        <div
          className={cn(
            '@xs/chat:w-[5.9375rem] @xs/chat:h-[5.9375rem] @xs/chat:mb-[0.88rem]',
            '@2xl/chat:w-[6.875rem] @2xl/chat:h-[6.875rem]',
            'flex items-center justify-center bg-blue-gray-75 rounded-full',
          )}
        >
          <Icon
            name={icon}
            fill="#5C697C"
            size={50}
            className={cn('@xs/chat:w-[2.5625rem]', '@2xl/chat:w-12 ')}
          />
        </div>
        <figcaption className="text-xl/8 font-semibold tracking-tight dark:text-black whitespace-nowrap">
          {caption}
        </figcaption>
      </figure>
      {children}
    </div>
  );
}
