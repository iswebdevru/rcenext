import { clsx } from '@/shared/lib/ui';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type CheckboxField = {
  label: string;
} & Omit<ComponentPropsWithRef<'input'>, 'type'>;

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxField>(
  function CheckboxField({ label, className, ...props }, ref) {
    return (
      <label className="flex items-center gap-3 px-2 py-1">
        <input
          {...props}
          className="peer absolute appearance-none"
          type="checkbox"
          ref={ref}
        />
        <div
          className={clsx(
            className,
            'grid h-5 w-5 place-items-center rounded-md border border-zinc-200 fill-inherit text-transparent ring-primary-500 transition duration-75 peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-500 peer-focus-visible:ring-2 hover:border-zinc-400 dark:border-zinc-700 dark:ring-zinc-200 dark:peer-checked:border-transparent dark:peer-checked:bg-primary-600 dark:peer-checked:text-white hover:dark:border-zinc-500',
          )}
        >
          <FontAwesomeIcon icon={faCheck} fixedWidth className="text-xs" />
        </div>
        <div className="select-none text-sm font-semibold text-zinc-700 dark:text-zinc-400">
          {label}
        </div>
      </label>
    );
  },
);
