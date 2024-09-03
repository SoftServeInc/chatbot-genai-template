import type { Meta, StoryObj } from '@storybook/react';

import { FilterChip } from '../../..';

const meta = {
  title: 'Design System/Atoms/FilterChip',
  component: FilterChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    text: 'Awesome',
    isActive: true,
  },
};

export const Inactive: Story = {
  args: {
    text: 'Awesome',
    isActive: false,
  },
};

export const Disabled: Story = {
  args: {
    text: 'Awesome',
    isActive: false,
    disabled: true,
  },
};
