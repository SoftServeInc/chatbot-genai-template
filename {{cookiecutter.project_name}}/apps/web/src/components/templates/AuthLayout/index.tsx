import { useState, FC, Fragment, SVGProps } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { cn, Button, Icon, IconName } from 'ui';
import { Logo } from '@/components/atoms';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/constants';

import styles from './styles.module.scss';

type Mode = 'primary' | 'alternative';
interface AuthLayoutProps {
  logo?: {
    primary: FC<SVGProps<SVGSVGElement>>;
    alternative: FC<SVGProps<SVGSVGElement>>;
  };
  toggle?: {
    icon: {
      primary: IconName;
      alternative: IconName;
    };
    onToggle: (toggled: boolean) => void;
  };
  description?: {
    primary: string;
    alternative: string;
  };
}
export function AuthLayout({ logo, description, toggle }: AuthLayoutProps) {
  const [toggled, setToggled] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>('primary');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.app.route} />;
  }

  const handleClick = () => {
    setToggled(!toggled);
    setMode(!toggled ? 'alternative' : 'primary');

    if (toggle?.onToggle) {
      toggle.onToggle(!toggled);
    }
  };

  const LogoComponent = logo ? logo[mode] : Fragment;
  const toggleIcon = toggle?.icon ? toggle?.icon[mode] : IconName.settings;

  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <div
        className={cn(
          'rounded-xl m-auto flex flex-col items-center justify-between bg-white',
          styles.authCard,
          toggled ? 'w-[49.6875rem]' : 'w-[30rem]',
        )}
      >
        <header className="w-full relative">
          {logo ? <LogoComponent /> : <Logo interactive={false} />}
          {toggle ? (
            <Button
              variant="ghost"
              onClick={handleClick}
              className="p-2 absolute -top-[1.15rem] -right-[1.15rem]"
            >
              <Icon name={toggleIcon} />
            </Button>
          ) : null}
        </header>
        <Outlet />
        <footer className="w-full">
          {description ? (
            <p className="text-xs/5 tracking-tightest dark:text-black">{description[mode] || ''}</p>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
