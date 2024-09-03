import type { Meta, StoryObj } from '@storybook/react';

import { Capabilities } from '.';
import {
  QueryContainerSize,
  QueryContainerDecorator,
  QueryContainerName,
} from '../../../../.storybook/utils';
import { ChatMock } from '../../../../.storybook/stubs';

const meta = {
  title: 'Design System/Molecules/Capabilities',
  component: Capabilities,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    data: ChatMock.capabilities,
  },
} satisfies Meta<typeof Capabilities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XS: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.xs),
  ],
};

export const SM: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.sm),
  ],
};

export const MD: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.md),
  ],
};

export const LG: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
};
