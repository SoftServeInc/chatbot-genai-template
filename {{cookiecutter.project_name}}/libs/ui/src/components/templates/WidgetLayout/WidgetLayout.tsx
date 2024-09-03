import { ReactNode } from 'react';

interface WidgetLayoutProps {
  title?: string;
  children: ReactNode | ReactNode[];
}
export function WidgetLayout({ title, children }: WidgetLayoutProps) {
  return (
    <div className="payload flex flex-col flex-1 overflow-y-auto">
      {title && (
        <header className="bg-blue-gray-50 px-[1.19rem] py-2">
          <h6 className="text-sm/6 font-bold tracking-tightest dark:text-black">{title}</h6>
        </header>
      )}
      {children}
    </div>
  );
}
