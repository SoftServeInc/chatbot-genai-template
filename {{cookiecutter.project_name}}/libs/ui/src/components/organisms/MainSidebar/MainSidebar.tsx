import { ReactNode } from 'react';
import { cn } from '../../../lib/utils';

interface MainSidebarProps {
  expanded?: boolean;
  children: ReactNode | ReactNode[];
  className?: string;
}
export function MainSidebar({ expanded = true, children, className }: MainSidebarProps) {
  const width = expanded ? 'lg:w-[23rem] w-[7.1875rem]' : 'w-[7.1875rem]';
  return (
    <aside className={cn('@container/main-sidebar flex flex-col px-6 py-11', width, className)}>
      {children}
    </aside>
  );
}

interface MainSideBarHeaderProps {
  className?: string;
  children: ReactNode | ReactNode[];
}
export function MainSideBarHeader({ children, className }: MainSideBarHeaderProps) {
  return <header className={cn('flex', className)}>{children}</header>;
}

interface MainSideBarFooterProps {
  children: ReactNode | ReactNode[];
}
export function MainSideBarFooter({ children }: MainSideBarFooterProps) {
  return (
    <footer className="py-[1.19rem] border-t border-t-black/[0.15] dark:border-t-white/[0.25]">
      {children}
    </footer>
  );
}
