import { ReactNode, FC, SVGProps } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { cn, Button } from '../../../lib';
import { Icon, IconName } from '../../atoms';

interface HeaderAction {
  Icon?: FC<SVGProps<SVGSVGElement>>;
  action: () => void;
  text?: string;
}
interface PageLayoutHeaderProps {
  title?: string;
  actions?: HeaderAction[];
  enableFullScreen?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  handle?: { active: boolean; enter: () => void; exit: () => void };
  children?: ReactNode | ReactNode[];
}

export function PageLayoutHeader({
  title,
  actions,
  children,
  handle,
  enableFullScreen,
}: PageLayoutHeaderProps) {
  if (!title) {
    return null;
  }

  return (
    <header className="flex items-center justify-between p-3 border-b bg-white px-10 py-4 rounded-t-xl">
      <h5 className="whitespace-nowrap text-2xl/10 font-semibold tracking-[-.045em] text-black">
        {title}
      </h5>
      {children}
      {actions && actions.length
        ? actions.map(({ Icon: IconEl, action, text }) => (
            <Button key={text} className="-mr-8" variant="ghost" onClick={action}>
              {IconEl && <IconEl />}
              {text}
            </Button>
          ))
        : null}
      {enableFullScreen && !handle?.active && (
        <Button size="icon" variant="ghost" onClick={handle?.enter}>
          <Icon name={IconName.fullScreen} fill="#6C7275" />
        </Button>
      )}
      {enableFullScreen && handle?.active && (
        <Button size="icon" variant="ghost" onClick={handle?.exit}>
          <Icon name={IconName.exitFullScreen} fill="#6C7275" />
        </Button>
      )}
    </header>
  );
}

interface PageLayoutProps extends PageLayoutHeaderProps {
  children: ReactNode | ReactNode[];
  className?: string;
}
export function PageLayout({
  title,
  actions,
  className,
  children,
  enableFullScreen,
}: PageLayoutProps) {
  const handle = useFullScreenHandle();
  return (
    <FullScreen handle={handle} className="flex w-full h-full justify-center">
      <section
        className={cn(
          'min-w-[39.25rem] max-w-[98.125rem] flex flex-col w-full overflow-clip',
          'relative bg-blue-gray-25 shadow-chat-container rounded-[0.625rem]',
          className,
        )}
      >
        <PageLayoutHeader
          title={title}
          actions={actions}
          handle={handle}
          enableFullScreen={enableFullScreen}
        />

        {children}
      </section>
    </FullScreen>
  );
}
