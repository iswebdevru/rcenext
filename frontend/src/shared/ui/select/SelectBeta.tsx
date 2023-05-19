import { clsx } from '@/shared/lib/ui';
import { MouseEventHandler, PropsWithChildren, forwardRef } from 'react';

export const SelectBeta = forwardRef<HTMLDivElement, PropsWithChildren>(
  function Select({ children }, ref) {
    return (
      <div className="relative" ref={ref}>
        {children}
      </div>
    );
  }
);

export type SelectBetaOptionsProps = {
  isRevealed: boolean;
} & PropsWithChildren;

export const SelectBetaOptions = forwardRef<
  HTMLDivElement,
  SelectBetaOptionsProps
>(function Options({ isRevealed, children }, ref) {
  return (
    <div
      ref={ref}
      className={clsx({
        'absolute w-full mt-2 border rounded-md bg-white shadow-sm border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-600 transition-[opacity,transform] duration-200':
          true,
        'z-10 opacity-1 translate-y-0': isRevealed,
        'pointer-events-none visibility-hidden opacity-0 scale-75 -translate-y-8':
          !isRevealed,
      })}
    >
      <ul>{children}</ul>
    </div>
  );
});

export type SelectBetaOptionProps = {
  selected: boolean;
  onSelect: MouseEventHandler<HTMLButtonElement>;
} & PropsWithChildren;

export const SelectBetaOption = forwardRef<
  HTMLLIElement,
  SelectBetaOptionProps
>(function Option({ children, selected, onSelect }, ref) {
  return (
    <li
      className={clsx({
        'border-b border-b-zinc-200 dark:border-b-zinc-700 last:border-b-0':
          true,
        'bg-zinc-100 dark:bg-zinc-700': selected,
      })}
      ref={ref}
    >
      <button
        className="w-full px-3 py-2 text-sm text-left text-zinc-700 dark:text-zinc-200"
        onClick={onSelect}
      >
        {children}
      </button>
    </li>
  );
});
