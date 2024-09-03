import type { Meta, StoryObj } from '@storybook/react';
import UserPicture from '../../../../.storybook/stubs/assets/images/user-picture.png';
import { Question } from '.';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Molecules/Question',
  component: Question,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Question>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.md),
  ],
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    time: 'Tue Jan 23 2024 16:36:19 GMT+0200',
    avatar: UserPicture,
  },
};
