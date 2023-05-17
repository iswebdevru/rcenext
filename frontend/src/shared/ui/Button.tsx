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

const HAMBURGER_WIDTH = 100;
const HAMBURGER_HEIGHT = 100;
const HAMBURGER_LINE_HEIGHT = 10;
const HAMBURGER_GAP = (HAMBURGER_HEIGHT - HAMBURGER_LINE_HEIGHT * 3) / 2;

export const HamburgerButton = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithRef<'button'>
>(function HamburgerButton({ className, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={classNameWithDefaults('group/hamburger', className)}
    >
      <svg
        className="transition-colors w-9 fill-zinc-900 group-hover/hamburger:fill-zinc-400 dark:fill-zinc-500 dark:group-hover/hamburger:fill-zinc-200"
        viewBox={`0 0 ${HAMBURGER_WIDTH + 10} ${HAMBURGER_HEIGHT + 4}`}
      >
        <rect
          x={5}
          y={5 + 15}
          rx={5}
          width={HAMBURGER_WIDTH}
          height={HAMBURGER_LINE_HEIGHT}
        ></rect>
        <rect
          x={5}
          y={HAMBURGER_GAP + HAMBURGER_LINE_HEIGHT + 5}
          rx={5}
          width={HAMBURGER_WIDTH}
          height={HAMBURGER_LINE_HEIGHT}
        ></rect>
        <rect
          x={5}
          y={(HAMBURGER_GAP + HAMBURGER_LINE_HEIGHT) * 2 - 10}
          rx={5}
          width={HAMBURGER_WIDTH}
          height={HAMBURGER_LINE_HEIGHT}
        ></rect>
      </svg>
    </button>
  );
});
