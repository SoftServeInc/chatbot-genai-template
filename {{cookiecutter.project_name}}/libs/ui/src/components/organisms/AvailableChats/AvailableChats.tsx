import { cn } from '../../../lib/utils';
import { Button } from '../../../lib/shadcn.ui';
import { ChatsList } from '../../molecules';
import { Chat } from '../../../types';
import { Icon, IconName } from '../..';

export interface AvailableChatsProps {
  className?: string;
  selected: string;
  chats: Chat[];
  actions: {
    onSelect: (id: string) => void;
    onCreate: () => void;
    onRemove: (id: string) => void;
    onRename: (title: string, id: string) => void;
  };
}

export function AvailableChats({ selected, chats, actions, className }: AvailableChatsProps) {
  return (
    <aside
      className={cn(
        'flex flex-col justify-between min-w-[16.4375rem] w-[16.4375rem] p-1.5',
        className,
      )}
    >
      <ChatsList selected={selected} chats={chats} {...actions} />
      <Button
        variant="outline"
        className="font-semibold bg-transparent border-2 border-blue-600 dark:text-black"
        onClick={actions.onCreate}
      >
        <Icon name={IconName.plus} className="w-6 h-6 mr-2" />
        New Channel
      </Button>
    </aside>
  );
}
