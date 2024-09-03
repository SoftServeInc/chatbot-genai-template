import type { Meta, StoryObj } from '@storybook/react';

import { IconName, LogOutButton } from '..';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Atoms/LogOutButton',
  component: LogOutButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: <span>{`Add 'Prompt' Component here`}</span>,
    icon: IconName.logout,
    onClick: () => {
      // console.log('Logout clicked');
    },
  },
} satisfies Meta<typeof LogOutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Xs: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.xs),
  ],
};

export const Sm: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.sm),
  ],
};
