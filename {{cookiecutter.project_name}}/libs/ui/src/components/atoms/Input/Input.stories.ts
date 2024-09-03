import type { Meta, StoryObj } from '@storybook/react';

import { IconName, Input } from '..';

const meta = {
  title: 'Design System/Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const WithIcon: Story = {
  args: {
    icon: IconName.userTwo,
  },
};
