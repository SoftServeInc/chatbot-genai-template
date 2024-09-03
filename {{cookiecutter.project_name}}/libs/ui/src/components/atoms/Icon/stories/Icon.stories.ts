import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '../Icon';
import { IconName } from '../enums/icon';

const meta = {
  title: 'Design System/Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: IconName.bot,
  },
};
