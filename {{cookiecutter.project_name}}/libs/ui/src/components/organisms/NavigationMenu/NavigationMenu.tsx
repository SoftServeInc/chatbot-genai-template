import { ElementType, FC, SVGProps } from 'react';
import { NavigationLink } from '../../atoms/NavigationLink';
import styles from './styles.module.scss';
import { IconName } from '../..';

interface Navigation {
  to: string;
  title: string;
  details?: string;
  icon?: IconName;
}

interface NavigationMenuProps {
  caption?: {
    text: string;
    Icon?: FC<SVGProps<SVGSVGElement>>;
  };
  navigation: Navigation[];
  LinkComponent?: ElementType;
}

export function NavigationMenu({ caption, navigation, LinkComponent }: NavigationMenuProps) {
  return (
    <nav className="flex flex-col my-auto">
      {caption && (
        <p className="h-[4.125rem] mb-[0.19rem] py-3 px-5 flex items-center gap-x-5 text-sm/6 font-semibold">
          {caption.Icon && <caption.Icon className="dark:stroke-white" />}
          {caption.text}
        </p>
      )}

      <ul className={styles.navigationMenu}>
        {navigation && navigation.length
          ? navigation.map(({ to, title, details, icon }) => (
              <NavigationLink
                key={`${title}:${to}`}
                component={LinkComponent}
                to={to}
                title={title}
                details={details}
                icon={icon}
              />
            ))
          : null}
      </ul>
    </nav>
  );
}
