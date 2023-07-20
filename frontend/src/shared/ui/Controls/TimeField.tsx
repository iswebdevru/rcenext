import { clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type TimeFieldProps = ComponentPropsWithRef<'input'>;

export const TimeField = forwardRef<HTMLInputElement, TimeFieldProps>(
  function TimeField({ className, ...props }, ref) {
    return (
      <div>
        <input
          {...props}
          className={clsx(
            className,
            'h-8 w-full rounded-md px-3 text-sm outline-none ring-1 ring-inset ring-zinc-200 transition-shadow duration-75 focus:ring-2 focus:ring-primary-500 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700 dark:focus:ring-primary-700',
          )}
          ref={ref}
          type="time"
        />
      </div>
    );
  },
);
