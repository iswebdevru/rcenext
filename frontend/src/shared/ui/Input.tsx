import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ComponentPropsWithRef,
  PropsWithChildren,
  forwardRef,
  useId,
} from 'react';

export type TextFieldProps = ComponentPropsWithRef<'input'> & {
  isValid?: boolean | null;
  label?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
    const inputId = useId();

    return (
      <div>
        {props.label ? (
          <label
            className="block leading-8 mb-1 text-sm text-slate-600 font-semibold dark:text-zinc-200"
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
              'transition-[outline,border] leading-6 text-black min-w-0 dark:text-zinc-200 bg-white outline outline-blue-200 outline-0 rounded-md text-sm border px-3 py-1 w-full placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-4 focus:border-blue-500 dark:bg-zinc-800 dark:focus:border-blue-700 dark:outline-blue-700':
                true,
              'border-zinc-200 dark:border-zinc-700':
                props.isValid === null || props.isValid === undefined,
              'border-green-600 dark:border-green-600': props.isValid === true,
              'border-red-500 dark:border-red-500': props.isValid === false,
            }),
            props.className
          )}
        />
      </div>
    );
  }
);

export const InputSearch = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function InputSearch({ className, ...props }, ref) {
  return (
    <div
      className={classNameWithDefaults(
        'h-8 group/search flex gap-2 text-sm items-center transition-[border,outline] bg-white border outline outline-0 outline-blue-200 border-zinc-200 rounded-md w-full p-3 py-1 focus-within:outline-4 focus-within:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:focus-within:border-blue-900 dark:outline-blue-800',
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
        className="flex-grow min-w-0 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 dark:bg-zinc-800 text-slate-900 dark:text-zinc-200"
      />
    </div>
  );
});

export type LabelProps = {
  label: string;
} & PropsWithChildren;

export function Field({ children, label }: LabelProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-slate-700 dark:text-zinc-300">{label}</span>
      <div>{children}</div>
    </label>
  );
}
