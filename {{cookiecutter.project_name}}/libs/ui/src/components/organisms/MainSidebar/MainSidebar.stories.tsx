import type { Meta, StoryObj } from '@storybook/react';

import { MainSidebar, MainSideBarFooter, NavigationMenu } from '..';
import { ThemeModeToggle, UserInfo } from '../..';
import { UserMock } from '../../../../.storybook/stubs';
import { navigation } from '../../../../.storybook/stubs/navigationMenuData';

const meta = {
  title: 'Design System/Organisms/MainSidebar',
  component: MainSidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MainSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    children: '',
    expanded: true,
  },
  render: (args) => (
    <MainSidebar expanded={args.expanded}>
      {args.children}
      <NavigationMenu navigation={navigation} />
      <ThemeModeToggle />
      <MainSideBarFooter>
        <UserInfo
          avatar={UserMock.avatar_url}
          username={UserMock.username}
          // eslint-disable-next-line no-console
          onLogOut={() => console.log('Logout clicked')}
        />
      </MainSideBarFooter>
    </MainSidebar>
  ),
};

export const Collapsed: Story = {
  args: {
    expanded: false,
    children: '',
  },
  render: (args) => (
    <MainSidebar expanded={args.expanded}>
      {args.children}
      <NavigationMenu navigation={navigation} />
      <ThemeModeToggle />
      <MainSideBarFooter>
        <UserInfo
          avatar={UserMock.avatar_url}
          username={UserMock.username}
          // eslint-disable-next-line no-console
          onLogOut={() => console.log('Logout clicked')}
        />
      </MainSideBarFooter>
    </MainSidebar>
  ),
};
