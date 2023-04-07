import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef, useState } from 'react';

export const InputText = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function InputText({ className, ...props }, ref) {
  const [wasFocused, setWasFocused] = useState(false);

  return (
    <input
      ref={ref}
      className={classNameWithDefaults(
        clsx({
          'transition-[outline,border] text-black dark:text-slate-200 bg-white outline outline-blue-200 outline-0 h-8 rounded-md text-sm border border-slate-200 px-3 py-1 w-full focus:outline-4 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-blue-700 dark:outline-blue-600':
            true,
          'valid:border-green-600 invalid:border-red-500 dark:valid:border-green-600 dark:invalid:border-red-500':
            wasFocused,
        }),
        className
      )}
      onFocus={() => setWasFocused(true)}
      {...props}
    />
  );
});

export const InputSearch = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function InputSearch({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNameWithDefaults(
        'transition-[border,outline] border outline outline-0 outline-blue-200 border-slate-200 rounded-md w-full pl-8 pr-2 py-1 focus:outline-4 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700',
        className
      )}
    />
  );
});
