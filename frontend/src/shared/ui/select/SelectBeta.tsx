import { useClickOutside, usePositionCoords } from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useLayoutEffect,
  useRef,
} from 'react';
import useTransition from 'react-transition-state';
import { Portal, useZIndex } from '../utils';

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

  const zIndex = useZIndex();

  const [transitionState, toggleTransition] = useTransition({
    timeout: 200,
    preEnter: true,
    mountOnEnter: true,
    unmountOnExit: true,
  });

  const { width, left, top, recalculatePosition } =
    usePositionCoords(componentRef);

  useClickOutside(componentRef, onClose);

  useLayoutEffect(() => {
    if (isRevealed) {
      recalculatePosition();
      toggleTransition(true);
    } else {
      toggleTransition(false);
    }
  }, [isRevealed, recalculatePosition]);

  return (
    <div ref={componentRef}>
      {inputElement}
      {transitionState.isMounted ? (
        <Portal>
          <div
            style={
              {
                '--tw-translate-x': `${left}px`,
                '--tw-translate-y': `${top}px`,
                width,
                zIndex,
              } as React.CSSProperties
            }
            className={clsx({
              'fixed left-0 top-0 max-h-60 origin-top transform overflow-y-auto rounded-md border border-zinc-200 bg-white scrollbar-thin scrollbar-thumb-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:scrollbar-thumb-zinc-600':
                true,
              'scale-90 opacity-0':
                transitionState.status === 'preEnter' ||
                transitionState.status === 'exiting',
              'transition-[opacity,transform] duration-200':
                transitionState.status === 'entering' ||
                transitionState.status === 'exiting',
            })}
          >
            <ul>{children}</ul>
          </div>
        </Portal>
      ) : null}
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
