import type { Meta, StoryObj } from '@storybook/react';

import { NavigationMenu } from '..';
import { IconName } from '../..';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Organisms/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    navigation: [
      {
        to: '#',
        title: 'Lorem ipsum dolor sit amet',
        details: 'Details',
        icon: IconName.settings,
      },
      {
        to: '#',
        title: 'Ipsum dolor sit amet',
        details: 'Details',
        icon: IconName.attachment,
      },
    ],
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const XS: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.xs),
  ],
};

export const SM: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.sm),
  ],
};
