import { cn } from 'ui';
import FullLogo from '@/assets/images/logo/Logo-Dark-Opt B.svg?react';
import SmallLogo from '@/assets/images/logo/Logo-Dark-Small.svg?react';

interface LogoProps {
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}
export function Logo({ className, onClick, interactive = true }: LogoProps) {
  if (!interactive) {
    return <FullLogo className={cn(className)} />;
  }

  return (
    <button type="button" className="mx-2.5" onClick={onClick}>
      <FullLogo className={cn('@xs/main-sidebar:block hidden dark:fill-white', className)} />
      <SmallLogo className={cn('@xs/main-sidebar:hidden dark:fill-white')} />
      <span className="hidden">App Logo</span>
    </button>
  );
}
