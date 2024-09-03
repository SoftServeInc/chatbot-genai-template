import type { Meta, StoryObj } from '@storybook/react';

import { Feedback } from '..';

const meta = {
  title: 'Design System/Molecules/Feedback',
  component: Feedback,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {
  args: {
    quickOptions: ['Right', 'Simple', 'Finished'],
  },
};

export const Negative: Story = {
  args: {
    quickOptions: ['Not Relevant', 'Danger', 'Other'],
  },
};

export const EmptyQuickOptions: Story = {
  args: {},
};
