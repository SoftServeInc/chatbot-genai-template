import type { Meta, StoryObj } from '@storybook/react';
import { ThemeModeToggle } from '..';

const meta = {
  title: 'Design System/Atoms/ThemeModeToggle',
  component: ThemeModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemeModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
