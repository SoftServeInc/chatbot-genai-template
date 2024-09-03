import { GenericEntity } from '@/types/Generic';

export enum MessageType {
  text = 'text',
  responds = 'responds',
}

export enum MessageAuthor {
  assistant = 'assistant',
  user = 'user',
}

export interface MessageSegment {
  type: MessageType;
  content: string;
}

export interface MessageRating {
  rating: number;
  comment?: string;
}

export interface Message extends GenericEntity {
  chat_id?: string;
  in_progress?: boolean;
  role: MessageAuthor;
  segments: MessageSegment[];
  feedback_rating?: number;
}
