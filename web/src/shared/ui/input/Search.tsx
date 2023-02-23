import { classNameWithDefaults } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export const Search = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function SearchInput({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      className={classNameWithDefaults(
        'border rounded-md w-full pl-8 pr-2 py-1',
        className
      )}
    />
  );
});
