import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '..';

const meta = {
  title: 'Design System/Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
