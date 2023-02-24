import { classNameWithDefaults, className } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type ButtonProps = {
  variant?: 'a' | 'b' | 'c';
} & ComponentPropsWithRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, className: addClassName, ...props }, ref) {
    return (
      <button
        {...props}
        className={classNameWithDefaults(
          className({
            'border rounded-md px-3 py-1 bg-white border-slate-300': true,
          }),
          addClassName
        )}
        ref={ref}
      ></button>
    );
  }
);
