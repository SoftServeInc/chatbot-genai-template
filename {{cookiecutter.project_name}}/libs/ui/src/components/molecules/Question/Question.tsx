import { ReactNode } from 'react';
import { Avatar, Timestamp } from '../../atoms';
import { MessageCard } from '../MessageCard';

interface QuestionProps {
  time?: string;
  avatar?: string;
  children?: ReactNode | ReactNode[];
}

export function Question({ time, avatar, children }: QuestionProps) {
  return (
    <MessageCard className="ml-auto">
      <MessageCard.Body className="items-end">
        <Timestamp>{time}</Timestamp>
        <MessageCard.Content className="flex items-center bg-blue-gray-75 whitespace-pre-line">
          {children}
        </MessageCard.Content>
      </MessageCard.Body>
      <Avatar
        src={avatar}
        size={55}
        className="@xs/chat:hidden @2xl/chat:block ml-4 bg-transparent"
      />
    </MessageCard>
  );
}
