import type { Meta, StoryObj } from '@storybook/react';
import { Options } from 'react-markdown';
import { Markdown } from '..';

const meta: {
  component: React.FunctionComponent<Options>;
  title: string;
  parameters: { layout: string };
  tags: string[];
} = {
  title: 'Design System/Atoms/Markdown',
  component: Markdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: '**Hello world!!!** Hello Markdown!',
  },
};
