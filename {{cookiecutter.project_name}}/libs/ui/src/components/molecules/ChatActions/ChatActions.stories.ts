import type { Meta, StoryObj } from '@storybook/react';

import { ChatActions } from '..';
import { ChatMock } from '../../../../.storybook/stubs';

const meta = {
  title: 'Design System/Molecules/ChatActions',
  component: ChatActions,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    parentId: '6ec9a1aa-814c-42f3-91db-f373593d3940',
    actions: ChatMock.actions,
  },
};
