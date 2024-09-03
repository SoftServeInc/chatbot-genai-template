import { Avatar } from '../../atoms/Avatar';
import { LogOutButton } from '../../atoms/LogOutButton';
import { IconName } from '../..';

interface UserInfoProps {
  avatar?: string;
  username?: string;
  onLogOut?: () => void;
}

export function UserInfo({ avatar, username, onLogOut }: UserInfoProps) {
  return (
    <div className="flex items-center px-2 gap-[0.81rem] dark:text-[#E8ECEF]/[0.85]">
      <Avatar
        size={40}
        src={avatar}
        className="hidden @xs/main-sidebar:block bg-transparent border-2 dark:border-[#D9D9D9]/[.2]"
      />
      <LogOutButton icon={IconName.logout} onClick={onLogOut}>
        <strong className="font-bold">{username || 'Guest User'}</strong>
        Log Out
      </LogOutButton>
    </div>
  );
}
