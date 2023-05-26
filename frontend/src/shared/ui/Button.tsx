import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'danger' | 'common' | 'danger-outline';
} & ComponentPropsWithRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'common', className: addClassName, ...props },
    ref
  ) {
    return (
      <button
        {...props}
        className={classNameWithDefaults(
          clsx({
            'transition-[background,color,border-color] select-none border rounded-md px-3 py-1 text-sm font-semibold':
              true,
            'bg-blue-600 border-blue-600 text-white enabled:hover:bg-blue-800 enabled:hover:border-blue-800 disabled:text-blue-50 disabled:bg-blue-200 disabled:border-blue-200 dark:disabled:bg-zinc-700 dark:disabled:border-zinc-700 dark:disabled:text-zinc-600':
              variant === 'primary',
            'bg-white border-red-500 text-red-500 enabled:hover:bg-red-600 enabled:hover:text-white disabled:text-red-200 disabled:border-red-200 dark:bg-transparent dark:border-red-600 dark:text-red-600 dark:disabled:text-red-900 dark:disabled:border-red-900 dark:enabled:hover:bg-red-700 dark:enabled:hover:text-white':
              variant === 'danger-outline',
            'bg-zinc-200 border-zinc-200 text-zinc-900 hover:bg-zinc-300 hover:border-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-600 dark:hover:border-zinc-600 dark:hover:text-white':
              variant === 'common',
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

export type HamburgerButtonProps = {
  variant?: 'zinc' | 'contrast';
} & ComponentPropsWithRef<'button'>;

export const HamburgerButton = forwardRef<
  HTMLButtonElement,
  HamburgerButtonProps
>(function HamburgerButton({ className, variant = 'zinc', ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={classNameWithDefaults('group/hamburger', className)}
    >
      <svg
        className={clsx({
          'w-full transition-colors': true,
          'fill-zinc-700 group-hover/hamburger:fill-zinc-400 dark:fill-zinc-200 dark:group-hover/hamburger:fill-zinc-200':
            variant === 'zinc',
          'fill-white group-hover/hamburger:fill-zinc-100':
            variant === 'contrast',
        })}
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
