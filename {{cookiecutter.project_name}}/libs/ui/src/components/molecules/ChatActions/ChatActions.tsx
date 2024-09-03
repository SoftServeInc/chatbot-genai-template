import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '../../../lib/shadcn.ui';
import { Icon, IconName } from '../..';

export interface ChatAction {
  name: string;
  icon: IconName;
  action: (id: string) => void;
}

interface ChatActionsProps {
  parentId: string;
  actions: ChatAction[];
  className?: string;
}

export function ChatActions({ parentId, actions, className }: ChatActionsProps) {
  if (!parentId || !actions || !actions.length) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Icon name={IconName.moreHoriz} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 dark:bg-white dark:text-black">
        <DropdownMenuGroup>
          {actions.map(({ name, icon, action }) => (
            <DropdownMenuItem key={name} onClick={() => action(parentId)}>
              {icon && <Icon name={icon} className="mr-2 h-4 w-4" />}
              <span>{name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
