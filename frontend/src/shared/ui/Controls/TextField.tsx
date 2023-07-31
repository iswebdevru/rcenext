import { ComponentPropsWithRef, forwardRef, useId } from 'react';
import { clsx } from '@/shared/lib/ui';

export type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'id'> & {
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
          className={clsx(
            props.className,
            'h-8 w-full min-w-0 rounded-md border-none bg-white px-3 text-sm leading-6 text-black outline-none ring-1 ring-inset transition duration-75 placeholder:text-zinc-400 focus:ring-2 focus:ring-primary-500',
            {
              'ring-zinc-200': props.error === undefined,
              'ring-green-600 dark:ring-green-600': props.error === null,
              'ring-red-500 dark:ring-red-500': typeof props.error === 'string',
              'dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:ring-primary-700':
                !props.variant,
              'dark:ring-zinc-700': !props.variant && props.error === undefined,
            },
          )}
        />
        {props.error ? (
          <p className="mt-1 text-sm text-red-500 dark:text-red-600">
            {props.error}
          </p>
        ) : null}
      </div>
    );
  },
);
