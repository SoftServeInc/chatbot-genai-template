import type { Meta, StoryObj } from '@storybook/react';

import { withRouter } from 'storybook-addon-react-router-v6';
import { InlayBigPage } from '..';

const meta = {
  title: 'Design System/Pages/InlayBigPage',
  component: InlayBigPage,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InlayBigPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [withRouter],
};
