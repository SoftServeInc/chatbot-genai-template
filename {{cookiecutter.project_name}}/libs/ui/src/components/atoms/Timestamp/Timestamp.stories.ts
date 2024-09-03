import type { Meta, StoryObj } from '@storybook/react';
import { Timestamp } from '..';

const meta = {
  title: 'Design System/Atoms/Timestamp',
  component: Timestamp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timestamp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '2024-01-22T15:03:59.648154+00:00',
  },
};
