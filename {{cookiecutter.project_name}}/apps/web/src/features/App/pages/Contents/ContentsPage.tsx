import { NavLink } from 'react-router-dom';
import { Icon, IconName, PageLayout } from 'ui';
import { APP_ROUTES } from '@/constants';

export function ContentsPage() {
  const templates = Object.values(APP_ROUTES.app.children.templates);

  return (
    <PageLayout className="bg-white py-20 px-[2.44rem]">
      <header className="text-center dark:text-black">
        <h1 className="text-[2.5rem] leading-[4rem] tracking-[-.1rem] font-bold">Contents</h1>
        <h3 className="text-2xl/[2.25rem] tracking-[-.03rem] font-normal text-neutral-04-100">
          Virtual Assistant / Chatbot UI Templates
        </h3>
      </header>
      <nav className="mt-10 mx-auto w-[30.75rem] flex flex-col gap-5 dark:text-black">
        {templates.map(({ img, name, details, route }) => (
          <li
            key={name}
            className="bg-neutral-01-100 p-4 flex items-center gap-6 border rounded-xl cursor-pointer transition-shadow hover:shadow-[0_33px_24px_-17px_rgba(0,0,0,0.12),0_0_16px_4px_rgba(0,0,0,0.04)]"
          >
            {img && <img src={img} alt={`${name}: ${details}`} />}
            <NavLink to={route} className="flex flex-col flex-1">
              <strong className="font-semibold text-lg/[1.3125rem]">{name}</strong>
              <span className="text-sm/[1.3125rem]">{details}</span>
            </NavLink>
            <Icon name={IconName.rightThree} fill="#6C7275" className="mx-4" />
          </li>
        ))}
      </nav>
    </PageLayout>
  );
}
