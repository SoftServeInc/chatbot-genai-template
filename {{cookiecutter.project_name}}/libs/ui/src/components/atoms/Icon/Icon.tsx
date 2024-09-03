import { HTMLProps } from 'react';
import { IconName } from './enums/icon';
import sprite from './assets/sprite.svg';

interface IconProps {
  name: IconName;
  size?: number;
  fill?: string;
  className?: HTMLProps<HTMLElement>['className'];
}

export function Icon({ name, size = 24, fill = '#191A1D', className = '' }: IconProps) {
  return (
    <svg
      className={className}
      fill={fill}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <use href={`${sprite}#${name}.icon`} />
    </svg>
  );
}
