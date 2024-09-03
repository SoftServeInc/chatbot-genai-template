import { ElementType } from 'react';
import { cn } from '../../../lib/utils';
import styles from './styles.module.scss';
import { Icon, IconName } from '..';

interface NavigationLinkProps {
  component?: ElementType;
  to: string;
  title: string;
  details?: string;
  icon?: IconName;
}

export function NavigationLink({
  component: Component = 'a',
  to,
  title,
  details,
  icon,
}: NavigationLinkProps) {
  const linkProps = to ? { to } : { href: to || '#' };
  return (
    <li data-with-icon={!!icon} className={cn('h-[4.125rem] mb-[0.19rem]', styles.navigationLink)}>
      <Component
        {...linkProps}
        role="link"
        className={cn(
          '@xs/main-sidebar:pr-5 @xs/main-sidebar:pl-16',
          'py-3 px-5 border-2 border-transparent rounded-[0.5rem] h-full flex items-center gap-x-5 text-sm',
          'transition-colors hover:border-[rgba(20,23,24,0.1)] dark:hover:border-[rgba(217,217,217,0.2)]',
          '[&.active]:bg-[rgba(20,23,24,0.1)] dark:[&.active]:bg-[rgba(217,217,217,0.2)]',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
      >
        {icon && <Icon name={icon} className={cn(styles.Icon, 'dark:stroke-white ')} />}
        <p className="@xs/main-sidebar:flex hidden flex-col dark:text-[#E8ECEF]/[0.85]">
          <small className="text-xs leading-[1.3125rem] tracking-[0.015rem]">{details}</small>
          <strong className="font-bold">{title}</strong>
        </p>
      </Component>
    </li>
  );
}
