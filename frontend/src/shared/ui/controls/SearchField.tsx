import { clsx } from '@/shared/lib/ui';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type InputSearchProps = ComponentPropsWithRef<'input'> & {
  variant?: 'darker' | 'lighter';
};

export const SearchField = forwardRef<HTMLInputElement, InputSearchProps>(
  function SearchField(props, ref) {
    return (
      <div
        className={clsx(
          props.className,
          'group/search flex h-8 w-full items-center gap-2 rounded-md bg-white p-3 text-sm ring-1 ring-inset ring-zinc-200 transition duration-75 focus-within:ring-2 focus-within:ring-primary-500',
          !props.variant &&
            'dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:focus-within:ring-blue-700',
        )}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          fixedWidth
          size="xs"
          className="text-zinc-400 transition-colors group-focus-within/search:text-blue-500 dark:text-zinc-400 dark:group-focus-within/search:text-blue-600"
        />
        <input
          {...props}
          ref={ref}
          className="min-w-0 flex-grow border-none bg-transparent outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-400"
        />
      </div>
    );
  },
);
