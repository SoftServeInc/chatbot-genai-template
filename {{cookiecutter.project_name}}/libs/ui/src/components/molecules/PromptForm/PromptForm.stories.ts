import type { Meta, StoryObj } from '@storybook/react';
import { PromptForm } from '..';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../../.storybook/utils';

const meta = {
  title: 'Design System/Molecules/PromptForm',
  component: PromptForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    multiline: true,
  },
} satisfies Meta<typeof PromptForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XS: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.xs),
  ],
};

export const SM: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.sm),
  ],
};

export const MD: Story = {
  decorators: [
    (Story) => QueryContainerDecorator(Story, QueryContainerName.chat, QueryContainerSize.md),
  ],
};
