import { GenericEntity, Pagination } from '@/types/Generic';
import { Message } from './Message';

export interface Chat extends GenericEntity {
  user_id: string;
  title: string;
  messages?: Message[];
  details?: string;
}

export interface Chats {
  meta: {
    page: Pagination;
  };
  data: Chat[];
}
