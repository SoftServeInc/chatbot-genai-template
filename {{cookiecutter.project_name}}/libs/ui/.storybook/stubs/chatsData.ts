import { v4 as uuid } from 'uuid';
import { Chat } from '../../src/types';
import { UserMock } from './userData';

const chats: Chat[] = [
  {
    id: uuid(),
    title: 'Chat 1',
    user_id: UserMock.id,
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: 'Chat 2',
    user_id: UserMock.id,
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
  },
  {
    id: uuid(),
    title: 'Chat 3',
    user_id: UserMock.id,
    created_at: new Date().toISOString(),
    modified_at: new Date().toISOString(),
  },
];

const actions = {
  onSelect: (id: string) => console.log(`Select chat with id: ${id}`),
  onCreate: () => console.log('Create new chat'),
  onRemove: (id: string) => console.log(`Remove chat with id: ${id}`),
  onRename: (title: string, id: string) => console.log(`Rename chat with id: ${id} to ${title}`),
};

export const ChatsMock = {
  selected: chats[1].id,
  chats,
  actions,
};
