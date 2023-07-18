import { clsx } from '@/shared/lib/ui';
import { ComponentPropsWithRef, forwardRef } from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'danger' | 'common' | 'danger-outline';
} & ComponentPropsWithRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'common', className, ...props }, ref) {
    return (
      <button
        {...props}
        className={clsx(
          className,
          'w-full select-none rounded-md border px-3 py-1 text-sm font-medium transition-[background,color,border-color]',
          {
            'border-transparent bg-blue-600 text-white enabled:hover:bg-blue-800 disabled:bg-blue-600/50 disabled:text-blue-50/75':
              variant === 'primary',
            'border-red-500 bg-white text-red-500 enabled:hover:bg-red-600 enabled:hover:text-white disabled:border-red-200 disabled:text-red-200 dark:border-red-600 dark:bg-transparent dark:text-red-600 dark:enabled:hover:bg-red-700 dark:enabled:hover:text-white dark:disabled:border-red-900 dark:disabled:text-red-900':
              variant === 'danger-outline',
            'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 dark:hover:text-white':
              variant === 'common',
          },
        )}
        ref={ref}
      ></button>
    );
  },
);

const HAMBURGER_WIDTH = 90;
const HAMBURGER_HEIGHT = 100;
const HAMBURGER_LINE_HEIGHT = 10;
const HAMBURGER_GAP = 15;
const HAMBURGER_START =
  (HAMBURGER_HEIGHT - HAMBURGER_GAP * 2 - HAMBURGER_LINE_HEIGHT * 3) / 2;

export type HamburgerButtonProps = {
  variant?: 'zinc' | 'contrast';
  close?: boolean;
} & ComponentPropsWithRef<'button'>;

export const HamburgerButton = forwardRef<
  HTMLButtonElement,
  HamburgerButtonProps
>(function HamburgerButton(
  { className, close = false, variant = 'zinc', ...props },
  ref,
) {
  return (
    <button {...props} ref={ref} className={clsx('group/hamburger', className)}>
      <svg
        className={clsx('w-full transition-colors', {
          'fill-zinc-700 group-hover/hamburger:fill-zinc-400 dark:fill-zinc-200 dark:group-hover/hamburger:fill-zinc-200':
            variant === 'zinc',
          'fill-white group-hover/hamburger:fill-zinc-100':
            variant === 'contrast',
        })}
        viewBox={`0 0 ${HAMBURGER_WIDTH + 10} ${HAMBURGER_HEIGHT}`}
      >
        {close ? (
          <>
            <rect
              x={5}
              y={HAMBURGER_START + HAMBURGER_LINE_HEIGHT + HAMBURGER_GAP}
              rx={5}
              width={HAMBURGER_WIDTH}
              height={HAMBURGER_LINE_HEIGHT}
              transform={`rotate(45 ${5 + HAMBURGER_WIDTH / 2} ${
                HAMBURGER_START +
                HAMBURGER_LINE_HEIGHT +
                HAMBURGER_GAP +
                HAMBURGER_LINE_HEIGHT / 2
              })`}
            ></rect>
            <rect
              x={5}
              y={HAMBURGER_GAP + HAMBURGER_LINE_HEIGHT + 5}
              rx={5}
              width={0}
              height={HAMBURGER_LINE_HEIGHT}
            ></rect>
            <rect
              x={5}
              y={HAMBURGER_START + HAMBURGER_LINE_HEIGHT + HAMBURGER_GAP}
              rx={5}
              width={HAMBURGER_WIDTH}
              height={HAMBURGER_LINE_HEIGHT}
              transform={`rotate(135 ${5 + HAMBURGER_WIDTH / 2} ${
                HAMBURGER_START +
                HAMBURGER_LINE_HEIGHT +
                HAMBURGER_GAP +
                HAMBURGER_LINE_HEIGHT / 2
              })`}
            ></rect>
          </>
        ) : (
          <>
            <rect
              x={5}
              y={HAMBURGER_START}
              rx={5}
              width={HAMBURGER_WIDTH}
              height={HAMBURGER_LINE_HEIGHT}
            ></rect>
            <rect
              x={5}
              y={HAMBURGER_START + HAMBURGER_LINE_HEIGHT + HAMBURGER_GAP}
              rx={5}
              width={HAMBURGER_WIDTH}
              height={HAMBURGER_LINE_HEIGHT}
            ></rect>
            <rect
              x={5}
              y={
                HAMBURGER_START +
                HAMBURGER_LINE_HEIGHT +
                HAMBURGER_GAP +
                HAMBURGER_LINE_HEIGHT +
                HAMBURGER_GAP
              }
              rx={5}
              width={HAMBURGER_WIDTH}
              height={HAMBURGER_LINE_HEIGHT}
            ></rect>
          </>
        )}
      </svg>
    </button>
  );
});
