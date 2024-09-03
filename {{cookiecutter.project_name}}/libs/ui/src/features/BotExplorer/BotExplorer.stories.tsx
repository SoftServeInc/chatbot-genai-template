import type { Meta, StoryObj } from '@storybook/react';

import { BotExplorer } from '..';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../.storybook/utils';

const meta = {
  title: 'Features/Application/BotExplorer',
  component: BotExplorer,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BotExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.md),
  ],
};
