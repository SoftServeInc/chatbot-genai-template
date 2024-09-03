import { ReactNode } from 'react';
import { getTime, getShortDate } from '../../../utils/datesAndTime';
import { cn } from '../../../lib/utils';

export interface TimestampProps {
  children: ReactNode;
  dateOnly?: boolean;
  className?: string;
}

export function Timestamp({ children, className, dateOnly }: TimestampProps) {
  if (!children || typeof children !== 'string') {
    return null;
  }

  const value = dateOnly ? getShortDate(children) : getTime(children);

  return (
    <time
      dateTime={`${children}`}
      className={cn('text-xs/5 tracking-tightest text-blue-gray-600 mb-[0.31rem]', className)}
    >
      {value}
    </time>
  );
}
