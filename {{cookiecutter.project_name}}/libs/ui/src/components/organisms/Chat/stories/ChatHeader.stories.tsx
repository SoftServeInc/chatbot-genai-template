import { StoryObj, Meta } from '@storybook/react';
import { ChatHeader } from '..';
import { ChatAction } from '../../../molecules/ChatActions';
import { IconName } from '../../../atoms';

const meta: Meta<typeof ChatHeader> = {
  title: 'Design System/Molecules/ChatHeader',
  component: ChatHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockActions: ChatAction[] = [
  // eslint-disable-next-line no-console
  { icon: IconName.edit, name: 'Edit', action: () => console.log('Edit clicked') },
  // eslint-disable-next-line no-console
  { icon: IconName.delete, name: 'Delete', action: () => console.log('Delete clicked') },
];

export const Primary: Story = {
  args: {
    className: 'w-full',
    parentId: 'chat1',
    title: 'Chat Title',
    actions: mockActions,
  },
};
