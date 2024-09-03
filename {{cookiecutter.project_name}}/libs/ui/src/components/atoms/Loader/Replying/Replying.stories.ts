import type { Meta, StoryObj } from '@storybook/react';
import { Replying } from '..';

const meta = {
  title: 'Design System/Atoms/Loader/Replying',
  component: Replying,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Replying>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
