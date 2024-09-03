import type { Meta, StoryObj } from '@storybook/react';

import { Assistant } from '.';
import {
  QueryContainerDecorator,
  QueryContainerName,
  QueryContainerSize,
} from '../../../.storybook/utils';

const meta = {
  title: 'Features/Application/Assitant',
  component: Assistant,
  args: {
    variant: 'default',
    header: {
      title: 'Chatbot Assistant',
    },
    styles: {
      header: 'pl-[0.94rem] pr-3 px-3 text-xl/8 font-semibold',
    },
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Assistant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.md),
  ],
};

export const Sidebar: Story = {
  args: {
    variant: 'sidebar',
  },
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.md),
  ],
};

export const Popup: Story = {
  args: {
    variant: 'popup',
  },
  decorators: [
    (Story) =>
      QueryContainerDecorator(Story, QueryContainerName.mainSidebar, QueryContainerSize.md),
  ],
};
