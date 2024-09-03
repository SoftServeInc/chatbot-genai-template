import type { StoryObj, Meta } from '@storybook/react';
import { AvailableChats } from '..';
import { ChatsMock } from '../../../../../.storybook/stubs';

const meta: Meta<typeof AvailableChats> = {
  title: 'Design System/Organisms/AvailableChats',
  component: AvailableChats,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    ...ChatsMock,
  },
};
