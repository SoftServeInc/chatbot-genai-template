import type { Meta, StoryObj } from '@storybook/react';

import { ChatsList } from '..';
import { ChatsMock } from '../../../../.storybook/stubs';

const meta = {
  title: 'Design System/Molecules/ChatsList',
  component: ChatsList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: ChatsMock,
} satisfies Meta<typeof ChatsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Empty: Story = {
  args: {
    chats: [],
  },
};
