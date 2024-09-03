import type { Meta, StoryObj } from '@storybook/react';

import { Answer } from '..';
import { MessageType } from '../../../../types';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../../.storybook/utils';
import { answer } from './stubs/answer';

const meta = {
  title: 'Design System/Molecules/Answer',
  component: Answer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Answer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextWithRating: Story = {
  args: answer,
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
};

export const TextWithoutRating: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    type: MessageType.text,
  },
};

export const Error: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
  args: {
    children: 'Error: Lorem ipsum dolor sit amet.',
    type: MessageType.error,
    rating: {
      data: {
        like: 1,
        dislike: 1,
      },
    },
  },
};

export const Responds: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    type: MessageType.responds,
    rating: {
      data: {
        like: 1,
        dislike: 1,
      },
    },
  },
};

export const XS: Story = {
  args: answer,
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.xs),
  ],
};

export const SM: Story = {
  args: answer,
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.sm),
  ],
};

export const MD: Story = {
  args: answer,
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.md),
  ],
};

export const LG: Story = {
  args: answer,
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.lg),
  ],
};
