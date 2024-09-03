import type { Meta, StoryObj } from '@storybook/react';

import { UserInfo } from '..';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Molecules/UserInfo',
  component: UserInfo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    username: 'John Smith',
  },
} satisfies Meta<typeof UserInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const XS: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.xs),
  ],
};
