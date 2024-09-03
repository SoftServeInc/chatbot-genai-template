import type { Meta, StoryObj } from '@storybook/react';

import { AvatarVariants } from './AvatarVariants';

const meta = {
  title: 'Design System/Atoms/Avatar/AvatarVariants',
  component: AvatarVariants,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AvatarVariants>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
