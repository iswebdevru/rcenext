import { classNameWithDefaults } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export const InputText = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function InputText({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={classNameWithDefaults(
        'transition-[outline] text-sm outline outline-1 outline-neutral-300 px-3 py-2 w-full h-full focus:outline-slate-500 valid:outline-green-600',
        className
      )}
      {...props}
    />
  );
});
