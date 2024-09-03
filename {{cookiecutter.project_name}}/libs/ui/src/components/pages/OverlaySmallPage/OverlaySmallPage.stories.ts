import type { Meta, StoryObj } from '@storybook/react';

import { OverlaySmallPage } from '..';

const meta = {
  title: 'Design System/Pages/OverlaySmallPage',
  component: OverlaySmallPage,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OverlaySmallPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
