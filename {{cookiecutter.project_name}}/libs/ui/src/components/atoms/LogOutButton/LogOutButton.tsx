import { ReactNode } from 'react';
import { Button } from '../../../lib/shadcn.ui';
import { cn } from '../../../lib/utils';
import { Icon, IconName } from '../..';

interface LogOutButtonProps {
  children: ReactNode | ReactNode[];
  icon?: IconName;
  onClick?: () => void;
}

export function LogOutButton({ children, icon, onClick }: LogOutButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="flex-1 justify-between h-fit p-0 text-[0.875rem]/[1.3125rem] tracking-[-.0175rem] rounded-none hover:bg-inherit dark:hover:text-white"
    >
      <p
        className={cn(
          '@xs/main-sidebar:flex',
          'hidden flex-col text-left text-xs/[1.3125rem] tracking-[0.015rem]',
        )}
      >
        {children}
      </p>
      {icon && (
        <Icon
          name={icon}
          size={50}
          className={cn('@xs/main-sidebar:m-0', 'm-auto w-6 h-6 dark:stroke-white/[0.5]')}
        />
      )}
    </Button>
  );
}
