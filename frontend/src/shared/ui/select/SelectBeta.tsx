import { useClickOutside } from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Portal } from '../Portal';
import useTransition from 'react-transition-state';

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

  const [transitionState, toggleTransition] = useTransition({
    timeout: 300,
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });

  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const recalculatePosition = () => {
    if (!componentRef.current) {
      return;
    }
    const componentRect = componentRef.current.getBoundingClientRect();
    setWidth(componentRect.width);
    setLeft(componentRect.x);
    setTop(componentRect.bottom);
  };

  useClickOutside(componentRef, onClose);

  // Resize event
  useEffect(() => {
    window.addEventListener('resize', recalculatePosition);
    return () => window.removeEventListener('resize', recalculatePosition);
  }, []);

  useLayoutEffect(() => {
    if (isRevealed) {
      toggleTransition(true);
      recalculatePosition();
    } else {
      toggleTransition(false);
    }
  }, [isRevealed]);

  return (
    <div ref={componentRef}>
      {inputElement}
      <Portal>
        {transitionState.isMounted ? (
          <div
            style={{ left, top, width }}
            className={clsx({
              'absolute z-10 border mt-2 rounded-md bg-white shadow-sm border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-600 transition-[opacity,transform] duration-300':
                true,
              'opacity-0 -translate-y-8 scale-75':
                transitionState.status === 'preEnter' ||
                transitionState.status === 'exiting',
            })}
          >
            <ul>{children}</ul>
          </div>
        ) : null}
      </Portal>
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
        'border-b border-b-zinc-200 dark:border-b-zinc-700 last:border-b-0':
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
