import { HTMLProps } from 'react';
import {
  Avatar as AvatarComponent,
  AvatarFallback,
  AvatarImage,
} from '../../../lib/shadcn.ui/avatar';
import BotIcon from '../../../assets/images/bot.image.svg';
import { cn } from '../../../lib/utils';
import { AvatarSize, AvatarIconType } from './enums';

interface AvatarProps {
  src?: string;
  size?: AvatarSize;
  displaName?: string;
  rounded?: boolean;
  type?: AvatarIconType;
  className?: HTMLProps<HTMLElement>['className'];
}

export function Avatar({
  src = BotIcon,
  displaName = 'AI',
  size = AvatarSize.xs,
  rounded,
  type,
  className = '',
}: AvatarProps) {
  const sizes: { [key: number]: string } = {
    24: 'w-6 h-6',
    30: 'w-[1.875rem] h-[1.875rem]',
    40: 'w-10 h-10',
    55: 'w-[3.4375rem] h-[3.4375rem]',
    80: 'w-20 h-20',
  };

  const bRadius: { [key: number]: string } = {
    24: 'rounded-[0.4375rem]',
    30: 'rounded-md',
    40: 'rounded-[0.625rem]',
    55: 'rounded-[0.9375rem]',
    80: 'rounded-[1.25rem]',
  };

  const padding: { [key: number]: string } = {
    24: 'p-1',
    30: 'p-[0.44rem]',
    40: 'p-2',
    55: 'p-[0.7rem]',
    80: 'p-7',
  };

  return (
    <AvatarComponent
      className={cn(
        'bg-blue-600',
        sizes[size],
        rounded && bRadius[size],
        type === AvatarIconType.icon && padding[size],
        className,
      )}
    >
      <AvatarImage src={src} />
      <AvatarFallback>{displaName}</AvatarFallback>
    </AvatarComponent>
  );
}
