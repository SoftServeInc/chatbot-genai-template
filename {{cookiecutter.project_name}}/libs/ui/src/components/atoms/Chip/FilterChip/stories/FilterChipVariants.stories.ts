import type { Meta, StoryObj } from '@storybook/react';

import { FilterChipVariants } from './FilterChipVariants';

const meta = {
  title: 'Design System/Atoms/FilterChip/FilterChipVariants',
  component: FilterChipVariants,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FilterChipVariants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
