import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef, useState } from 'react';

export const InputText = forwardRef<
  HTMLInputElement,
  ComponentPropsWithRef<'input'>
>(function InputText({ className, ...props }, ref) {
  const [wasFocused, setWasFocused] = useState(false);

  return (
    <input
      ref={ref}
      className={classNameWithDefaults(
        clsx({
          'transition-[outline,border] outline outline-blue-200 outline-0 h-8 rounded-md text-sm border border-neutral-200 px-3 py-1 w-full focus:outline-4 focus:border-blue-500':
            true,
          'valid:border-green-600 invalid:border-red-500': wasFocused,
        }),
        className
      )}
      onFocus={() => setWasFocused(true)}
      {...props}
    />
  );
});
