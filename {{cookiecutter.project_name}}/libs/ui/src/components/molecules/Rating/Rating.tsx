import { useState } from 'react';
import { Button } from '../../../lib/shadcn.ui';
import { Icon, IconName } from '../..';

enum VoteType {
  like = 'like',
  dislike = 'dislike',
}

interface Votes {
  like: number;
  dislike: number;
}

interface UserVote {
  current: VoteType | null;
  votes: Votes;
}

interface RatingProps {
  data?: Votes | null;
  showCount?: boolean;
  onChange?: (votes: Votes) => void;
}

export function Rating({ data, onChange, showCount = false }: RatingProps) {
  const [userVote, setUserVote] = useState<UserVote>({
    current: null,
    votes: data || { like: 0, dislike: 0 },
  });

  if (!data) {
    return null;
  }

  const handleClick = (value: VoteType) => {
    const votes = {
      like: value === VoteType.like ? 1 : 0,
      dislike: value === VoteType.dislike ? -1 : 0,
    };

    setUserVote({
      current: value,
      votes,
    });

    if (onChange) {
      onChange(votes);
    }
  };

  return (
    <div className="h-6 w-fit bg-white shadow-chat-message flex items-center rounded-[0.375rem]">
      <Button
        onClick={() => handleClick(VoteType.like)}
        disabled={userVote.current === VoteType.like}
        variant="ghost"
        size="icon"
        className={`h-auto py-1 px-2 rounded-[0.375rem] disabled:opacity-100 ${
          showCount ? 'px-2 box-content' : ''
        }`}
      >
        {userVote.votes.like > 0 ? (
          <Icon name={IconName.thumbUpFilled} className="h-5 w-5 block" />
        ) : (
          <Icon name={IconName.thumbUp} className="h-5 w-5 block" />
        )}
        {showCount && <span className="ml-2">{userVote.votes.like}</span>}
      </Button>
      <div className="divide-x h-3.5 w-px bg-blue-gray-100" />
      <Button
        onClick={() => handleClick(VoteType.dislike)}
        disabled={userVote.current === VoteType.dislike}
        variant="ghost"
        size="icon"
        className={`h-auto py-1 px-2 rounded-[0.375rem] disabled:opacity-100 ${
          showCount ? 'px-2 box-content' : ''
        }`}
      >
        {userVote.votes.dislike < 0 ? (
          <Icon name={IconName.thumbDownFilled} className="h-5 w-5 block" />
        ) : (
          <Icon name={IconName.thumbDown} className="h-5 w-5 block" />
        )}
        {showCount && <span className="ml-2">{userVote.votes.dislike}</span>}
      </Button>
    </div>
  );
}
