import type { Meta, StoryObj } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import { Frame } from '../components/Frame';
import { PageLayout } from '../../../components';
import { documentsData } from './stubs/documentsData';

const meta = {
  title: 'Features/Application/KnowledgeBase',
  component: Frame,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'lg',
    },
    mockData: [
      {
        url: '/documents',
        method: 'GET',
        status: 200,
        response: { data: documentsData },
      },
    ],
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Frame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  decorators: [withRouter],
  render: () => {
    return (
      <PageLayout title="Knowledge Base">
        <Frame />
      </PageLayout>
    );
  },
};
