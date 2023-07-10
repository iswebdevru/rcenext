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
    setLeft(componentRect.x + window.scrollX);
    setTop(componentRect.bottom + window.scrollY);
  };

  useClickOutside(componentRef, onClose);

  // Scroll event
  useEffect(() => {
    window.addEventListener('scroll', recalculatePosition);
    return () => window.removeEventListener('resize', recalculatePosition);
  }, []);

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
              'absolute z-10 mt-2 max-h-60 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-sm transition-[opacity,transform] duration-300 scrollbar-thin scrollbar-thumb-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:scrollbar-thumb-zinc-600':
                true,
              '-translate-y-8 scale-75 opacity-0':
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
        'border-b border-b-zinc-200 last:border-b-0 dark:border-b-zinc-700':
          true,
        'bg-zinc-100 dark:bg-zinc-700': selected,
      })}
      ref={ref}
    >
      <button
        className="w-full select-none overflow-hidden overflow-ellipsis whitespace-nowrap px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200"
        onClick={onSelect}
      >
        {children}
      </button>
    </li>
  );
});
