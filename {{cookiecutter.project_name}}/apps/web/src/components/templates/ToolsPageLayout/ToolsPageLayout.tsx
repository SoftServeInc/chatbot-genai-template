import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { MainSidebar, MainSideBarHeader, useTheme } from 'ui';
import { APP_ROUTES } from '@/constants';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/hooks/useAuth';
import ToolsLogo from '@/assets/images/logo/Tools-Logo-Small.svg?react';
import ToolsLogoDark from '@/assets/images/logo/Tools-Logo-Small-Dark.svg?react';

export function ToolsPageLayout() {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.app.route} />;
  }

  const handleClick = () => navigate(APP_ROUTES.app.route);

  return (
    <section className="flex flex-1 ">
      <MainSidebar expanded={false}>
        <MainSideBarHeader className="flex-col items-center justify-center gap-[2.6875rem]">
          {/dark|system/g.test(theme) ? <ToolsLogo /> : <ToolsLogoDark />}
          <Logo onClick={handleClick} />
        </MainSideBarHeader>
      </MainSidebar>
      <main className="flex flex-1 pl-0 p-[1.56rem]">
        <Outlet />
      </main>
    </section>
  );
}
