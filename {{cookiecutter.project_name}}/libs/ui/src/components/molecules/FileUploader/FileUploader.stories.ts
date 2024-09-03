import type { Meta, StoryObj } from '@storybook/react';

import { FileUploader } from '..';

const meta = {
  title: 'Design System/Molecules/FileUploader',
  component: FileUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
