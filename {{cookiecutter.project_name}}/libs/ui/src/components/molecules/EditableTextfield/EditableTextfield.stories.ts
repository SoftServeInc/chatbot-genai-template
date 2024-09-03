import type { Meta, StoryObj } from '@storybook/react';

import { EditableTextfield } from '..';

const meta = {
  title: 'Design System/Molecules/EditableTextField',
  component: EditableTextfield,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableTextfield>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
    shouldEdit: true,
  },
};
