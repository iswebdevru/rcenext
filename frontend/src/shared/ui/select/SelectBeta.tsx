import {
  useClickOutside,
  usePositionCoords,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useRef,
} from 'react';
import useTransition, { TransitionState } from 'react-transition-state';
import { Portal, useZIndex } from '../utils';
import { ignoreClick } from '@/shared/lib/dom';

export type SelectBetaProps = {
  onClose: () => void;
  inputElement: ReactNode;
  transitionState: TransitionState;
} & PropsWithChildren;

export const SelectBeta = withOutsideClickExceptionsContext(
  function SelectBeta({
    children,
    inputElement,
    onClose,
    transitionState: { status, isMounted },
  }: SelectBetaProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const optionsListRef = useRef<HTMLDivElement>(null);

    const zIndex = useZIndex();

    const { width, left, top } = usePositionCoords(outerRef, [isMounted]);

    useClickOutside(optionsListRef, ignoreClick(outerRef, onClose));

    return (
      <div ref={outerRef}>
        {inputElement}
        <Portal>
          {isMounted ? (
            <div
              ref={optionsListRef}
              style={
                {
                  '--tw-translate-x': `${left}px`,
                  '--tw-translate-y': `${top}px`,
                  width,
                  zIndex,
                } as React.CSSProperties
              }
              className="fixed left-0 top-0 transform"
            >
              <div
                className={clsx(
                  'max-h-60 origin-top transform overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-sm transition-[opacity,transform] duration-200 scrollbar-thin scrollbar-thumb-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:scrollbar-thumb-zinc-600',
                  (status === 'preEnter' || status === 'exiting') &&
                    '-translate-y-2 opacity-0',
                )}
              >
                <ul>{children}</ul>
              </div>
            </div>
          ) : null}
        </Portal>
      </div>
    );
  },
);

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
      className={clsx(
        'border-b border-b-zinc-200 last:border-b-0 dark:border-b-zinc-700',
        {
          'bg-zinc-100 dark:bg-zinc-700': selected,
        },
      )}
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

export function useSelectTransition() {
  return useTransition({
    timeout: 200,
    mountOnEnter: true,
    preEnter: true,
    unmountOnExit: true,
  });
}
