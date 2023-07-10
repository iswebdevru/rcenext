import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, forwardRef, useId } from 'react';

export type TextFieldProps = ComponentPropsWithRef<'input'> & {
  variant?: 'darker' | 'lighter';
  error?: string | null;
  label?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
    const inputId = useId();

    return (
      <div>
        {props.label ? (
          <label
            className="mb-1 block text-sm font-semibold leading-8 text-slate-600 dark:text-zinc-200"
            htmlFor={inputId}
          >
            {props.label}
          </label>
        ) : null}
        <input
          {...props}
          id={inputId}
          ref={ref}
          className={classNameWithDefaults(
            clsx({
              'w-full min-w-0 rounded-md border-none bg-white px-3 py-1.5 text-sm leading-6 text-black outline-none ring-1 ring-inset transition duration-75 placeholder:text-zinc-400 focus:ring-2 focus:ring-primary-500':
                true,
              'ring-zinc-200': props.error === undefined,
              'ring-green-600 dark:ring-green-600': props.error === null,
              'ring-red-500 dark:ring-red-500': typeof props.error === 'string',
              'dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:ring-blue-700':
                !props.variant,
              'dark:ring-zinc-600': !props.variant && props.error === undefined,
            }),
            props.className
          )}
        />
      </div>
    );
  }
);

export type InputSearchProps = ComponentPropsWithRef<'input'> & {
  variant?: 'darker' | 'lighter';
};

export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
  function InputSearch(props, ref) {
    return (
      <div
        className={classNameWithDefaults(
          clsx({
            'group/search flex h-8 w-full items-center gap-2 rounded-md bg-white p-3 py-1 text-sm ring-1 ring-inset ring-zinc-200 transition duration-75 focus-within:ring-2 focus-within:ring-primary-500':
              true,
            'dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:focus-within:ring-blue-700':
              !props.variant,
          }),
          props.className
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
  }
);
