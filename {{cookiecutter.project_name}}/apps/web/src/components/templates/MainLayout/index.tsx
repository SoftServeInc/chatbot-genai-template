import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  MainSidebar,
  MainSideBarHeader,
  MainSideBarFooter,
  NavigationMenu,
  ThemeModeToggle,
  UserInfo,
  IconName,
} from 'ui';
import { Logo } from '@/components/atoms/Logo';
import { useAuth } from '@/hooks';
import { APP_ROUTES } from '@/constants';

export default function MainLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { logout, userProfile } = useAuth();
  const templates = Object.values(APP_ROUTES.app.children.templates).map(
    ({ name, details, route }) => ({
      to: route,
      title: details,
      details: name,
    }),
  );
  const navigation = [
    {
      to: APP_ROUTES.app.children.contents.route,
      title: APP_ROUTES.app.children.contents.name,
      icon: IconName.contents,
    },
    ...templates,
    // temporary hidden routes
    // {
    //   to: APP_ROUTES.app.children.knowledgeBase.route,
    //   title: APP_ROUTES.app.children.knowledgeBase.name,
    //   icon: IconName.export,
    // },
    // {
    //   to: APP_ROUTES.app.children.botExplorer.route,
    //   title: APP_ROUTES.app.children.botExplorer.name,
    //   icon: IconName.settings,
    // },
  ];

  const handleClick = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <section className="flex flex-1 ">
      <MainSidebar expanded={sidebarExpanded}>
        <MainSideBarHeader>
          <Logo onClick={handleClick} />
        </MainSideBarHeader>
        <NavigationMenu navigation={navigation} LinkComponent={NavLink} />
        <ThemeModeToggle />
        <MainSideBarFooter>
          <UserInfo
            avatar={userProfile?.avatar_url}
            username={userProfile?.username}
            onLogOut={logout}
          />
        </MainSideBarFooter>
      </MainSidebar>
      <main className="flex flex-1 pl-0 p-[1.56rem]">
        <Outlet />
      </main>
    </section>
  );
}
