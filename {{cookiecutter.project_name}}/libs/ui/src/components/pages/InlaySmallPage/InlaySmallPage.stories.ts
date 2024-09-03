import type { Meta, StoryObj } from '@storybook/react';

import { InlaySmallPage } from '..';

const meta = {
  title: 'Design System/Pages/InlaySmallPage',
  component: InlaySmallPage,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InlaySmallPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
