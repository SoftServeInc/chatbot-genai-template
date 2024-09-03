import type { Meta, StoryObj } from '@storybook/react';

import { IconVariants } from './IconVariants';

const meta = {
  title: 'Design System/Atoms/Icon/IconVariants',
  component: IconVariants,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconVariants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
