import { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Chat } from '../../../types';
import { IconName, Timestamp } from '../../atoms';
import { ChatActions, EditableTextfield } from '..';
import { EmptyState } from './EmptyState';

interface ChatsListProps {
  selected: string;
  chats: Chat[];
  onSelect?: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (title: string, id: string) => void;
}

export function ChatsList({ selected, chats, onSelect, onRemove, onRename }: ChatsListProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const actions = [
    {
      name: 'Rename',
      icon: IconName.edit,
      action: () => setEditing(true),
    },
    {
      name: 'Delete',
      icon: IconName.delete,
      action: onRemove,
    },
  ];

  if (!chats || !chats.length) {
    return <EmptyState />;
  }

  const handleClick = (id: string) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleTitleUpdate = (value: string, id: string) => {
    onRename(value, id);
    setEditing(false);
  };

  return (
    <menu className="flex flex-col flex-1 overflow-y-auto items-stretch">
      {chats.map(({ id, title, details, modified_at }) => {
        return (
          <li
            key={id}
            // eslint-disable-next-line
            role="button"
            onKeyDown={() => {}}
            onClick={() => handleClick(id)}
            className={cn(
              'min-h-[2.9375rem] hover:rounded-xl transition-all',
              'hover:bg-white hover:shadow-[0_3px_3.9px_0_rgba(222,227,240,0.68)]',
              'flex flex-col justify-center self-auto mb-1 py-1.5 px-2.5 border-l-8 border-l-transparent',
              'text-sm/6 tracking-tightest dark:text-black border-b-[1px] border-b-blue-grey-75 hover:border-b-transparent',
              id === selected ? 'active' : '',
              '[&.active]:bg-white [&.active]:shadow-[0_3px_3.9px_0_rgba(222,227,240,0.68)] [&.active]:border-blue-600 [&.active]:rounded-xl [&.active]:border-b-transparent',
            )}
          >
            <p className="min-w-0 flex justify-between items-center gap-2.5">
              <EditableTextfield
                value={title}
                shouldEdit={id === selected && editing}
                onAfterChange={(value: string) => handleTitleUpdate(value, id)}
                className="font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
              />
              {id === selected && actions && !editing ? (
                <ChatActions parentId={id} actions={actions} />
              ) : null}
            </p>
            {details && details.length ? (
              <p className="min-w-0 flex justify-between items-center gap-2.5">
                <span className="text-ellipsis overflow-hidden whitespace-nowrap">{details}</span>
                <Timestamp className="min-w-[3.5rem] mb-0 self-end">{modified_at}</Timestamp>
              </p>
            ) : null}
          </li>
        );
      })}
    </menu>
  );
}
