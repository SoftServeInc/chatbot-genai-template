import * as React from 'react';
import type { StoryObj, Meta } from '@storybook/react';
import { Chat, ChatFooter } from '..';
import { Conversation } from '../../Conversation';
import { Answer, Question, PromptForm } from '../../../molecules';
import { MessageAuthor } from '../../../../types';
import { ChatMock, ChatsMock, UserMock } from '../../../../../.storybook/stubs';
import { AvailableChats } from '../..';

const meta: Meta<typeof Chat> = {
  title: 'Design System/Organisms/Chat',
  component: Chat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Chat>;

export const Primary: Story = {
  args: {
    ...ChatMock,
  },
  render: (args) => (
    <Chat {...args}>
      <Conversation>
        {ChatMock.messages.map(({ id, created_at, segments, role, feedback_rating }) => {
          if (role === MessageAuthor.user) {
            return (
              <Question key={id} time={created_at} avatar={UserMock.avatar_url}>
                {segments[0].content}
              </Question>
            );
          }
          return (
            <Answer
              key={id}
              realtime
              type={segments[0].type}
              rating={{
                data: {
                  like: feedback_rating && feedback_rating > 0 ? feedback_rating : 0,
                  dislike: feedback_rating && feedback_rating < 0 ? feedback_rating : 0,
                },
                onChange: (rating) => {
                  const feedback = {
                    rating: Object.values(rating).find((value) => value > 0 || value < 0) || 0,
                    comment: '',
                  };
                  // eslint-disable-next-line no-console
                  console.log(feedback, id);
                },
              }}
            >
              {segments[0].content}
            </Answer>
          );
        })}
      </Conversation>
      <ChatFooter>
        <PromptForm />
      </ChatFooter>
    </Chat>
  ),
};

export const EmptyState: Story = {
  render: (args) => (
    <Chat {...args}>
      <Conversation />
      <ChatFooter>
        <PromptForm />
      </ChatFooter>
    </Chat>
  ),
};

export const Capabilities: Story = {
  render: (args) => (
    <Chat {...args}>
      <Conversation capabilities={ChatMock.capabilities} />
      <ChatFooter>
        <PromptForm />
      </ChatFooter>
    </Chat>
  ),
};

export const WithChatsList: Story = {
  render: (args) => (
    <div className="flex bg-blue-gray-25">
      <AvailableChats className="border-r" {...ChatsMock} />
      <Chat {...args}>
        <Conversation capabilities={ChatMock.capabilities} />
        <ChatFooter>
          <PromptForm />
        </ChatFooter>
      </Chat>
    </div>
  ),
};
