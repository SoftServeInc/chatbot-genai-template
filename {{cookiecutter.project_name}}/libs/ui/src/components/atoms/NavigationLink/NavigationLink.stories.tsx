import type { Meta, StoryObj } from '@storybook/react';

import { IconName, NavigationLink } from '..';
import {
  QueryContainerSize,
  QueryContainerDecorator,
  QueryContainerName,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Atoms/NavigationLink',
  component: NavigationLink,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    to: '#',
    title: 'Title',
    details: 'Details',
    icon: IconName.settings,
  },
} satisfies Meta<typeof NavigationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XS: Story = {
  decorators: [
    (Story) => (
      <ul>
        {QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.xs)}
      </ul>
    ),
  ],
};

export const SM: Story = {
  decorators: [
    (Story) => (
      <ul>
        {QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.sm)}
      </ul>
    ),
  ],
};
