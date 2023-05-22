import { useClickOutside } from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useRef,
} from 'react';

export type SelectBetaProps = {
  onClose: () => void;
  isRevealed: boolean;
  inputElement: ReactNode;
} & PropsWithChildren;

export function SelectBeta({
  children,
  inputElement,
  onClose,
  isRevealed,
}: SelectBetaProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  useClickOutside(componentRef, onClose);

  return (
    <div className="relative" ref={componentRef}>
      {inputElement}
      <div
        className={clsx({
          'absolute left-0 top-full w-full mt-2 border rounded-md bg-white shadow-sm border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-600 transition-[opacity,transform] duration-200':
            true,
          'z-10 opacity-1 translate-y-0': isRevealed,
          'pointer-events-none invisible opacity-0 scale-75 -translate-y-8':
            !isRevealed,
        })}
      >
        <ul>{children}</ul>
      </div>
    </div>
  );
}

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
        'border-b border-b-zinc-200 dark:border-b-zinc-700 last:border-b-0 animate-option-appear':
          true,
        'bg-zinc-100 dark:bg-zinc-700': selected,
      })}
      ref={ref}
    >
      <button
        className="w-full px-3 py-2 overflow-hidden text-sm text-left select-none overflow-ellipsis whitespace-nowrap text-zinc-700 dark:text-zinc-200"
        onClick={onSelect}
      >
        {children}
      </button>
    </li>
  );
});
