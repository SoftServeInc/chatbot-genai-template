import type { Meta, StoryObj } from '@storybook/react';

import { Rating } from '..';

const meta = {
  title: 'Design System/Molecules/Rating',
  component: Rating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: {
      like: 0,
      dislike: 0,
    },
    showCount: false,
  },
};

export const WithCount: Story = {
  args: {
    data: {
      like: 0,
      dislike: 0,
    },
    showCount: true,
  },
};
