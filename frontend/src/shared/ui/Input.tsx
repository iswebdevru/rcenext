import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
          'transition-[outline,border] text-black min-w-0 dark:text-zinc-200 bg-white outline outline-blue-200 outline-0 h-8 rounded-md text-sm border border-zinc-200 px-3 py-1 w-full focus:outline-4 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus:border-blue-700 dark:outline-blue-700':
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
    <div
      className={classNameWithDefaults(
        'group/search flex gap-2 text-sm items-center transition-[border,outline] bg-white border outline outline-0 outline-blue-200 border-zinc-200 rounded-md w-full p-3 py-1 focus-within:outline-4 focus-within:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:border-blue-900 dark:outline-blue-800',
        className
      )}
    >
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        fixedWidth
        size="xs"
        className="transition-colors text-zinc-400 group-focus-within/search:text-blue-500 dark:group-focus-within/search:text-blue-600 dark:text-zinc-500"
      />
      <input
        {...props}
        ref={ref}
        className="min-w-0 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200"
      />
    </div>
  );
});
