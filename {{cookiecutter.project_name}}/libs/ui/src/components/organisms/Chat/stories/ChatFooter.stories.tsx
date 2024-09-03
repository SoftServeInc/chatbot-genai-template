import { StoryObj, Meta } from '@storybook/react';
import { ChatFooter } from '..';

const meta: Meta<typeof ChatFooter> = {
  title: 'Design System/Molecules/ChatFooter',
  component: ChatFooter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: <div>{`Add 'Prompt' Component here`}</div>,
    className: '',
  },
};
