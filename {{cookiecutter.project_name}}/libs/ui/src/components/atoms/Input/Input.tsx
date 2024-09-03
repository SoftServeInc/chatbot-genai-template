import { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { Icon, IconName } from '../..';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconName;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, type, placeholder, icon, ...props }, ref) => {
    return (
      <div
        className={cn(
          'h-[3.5rem] flex gap-3 items-center border-2 border-blue-gray-100 rounded-xl mb-5 py-2 px-4',
          className,
        )}
      >
        {icon && <Icon name={icon} />}
        <label htmlFor={id} className="relative flex flex-col flex-1">
          <input
            id={id}
            ref={ref}
            type={type}
            {...props}
            placeholder=""
            className="flex-1 focus-visible:outline-none focus:outline-none dark:text-black appearance-none peer disabled:bg-white"
          />
          <span
            className={cn(
              'text-[0.9375rem]/6 tracking-tightest text-blue-gray-600',
              'absolute top-0 start-0 z-10',
              'transform duration-300 -translate-y-4 scale-75 origin-[0]',
              'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4',
              'rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto',
            )}
          >
            {placeholder}
          </span>
        </label>
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
