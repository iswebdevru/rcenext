import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'danger' | 'common' | 'danger-outline';
} & ComponentPropsWithRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant, className: addClassName, ...props }, ref) {
    return (
      <button
        {...props}
        className={classNameWithDefaults(
          clsx({
            'transition-[background,color,border-color] border rounded-md px-3 py-1 text-sm font-semibold':
              true,
            'bg-blue-600 border-blue-600 text-white enabled:hover:bg-blue-800 enabled:hover:border-blue-800  disabled:bg-blue-200 disabled:border-blue-200':
              variant === 'primary',
            'bg-white border-red-600 text-red-600 enabled:hover:bg-red-600 enabled:hover:text-white disabled:text-red-300 disabled:border-red-200':
              variant === 'danger-outline',
          }),
          addClassName
        )}
        ref={ref}
      ></button>
    );
  }
);

export const HamburgerButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<'button'>
>(function HamburgerButton({ ...props }, ref) {
  return (
    <button {...props} ref={ref}>
      <svg className="w-10" viewBox="0 0 44 44">
        <rect></rect>
        <rect></rect>
        <rect></rect>
      </svg>
    </button>
  );
});
