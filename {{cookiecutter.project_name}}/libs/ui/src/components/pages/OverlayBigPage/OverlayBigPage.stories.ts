import type { Meta, StoryObj } from '@storybook/react';

import { OverlayBigPage } from '..';

const meta = {
  title: 'Design System/Pages/OverlayBigPage',
  component: OverlayBigPage,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OverlayBigPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
