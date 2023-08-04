'use client';

import {
  useClickOutside,
  usePositionCoords,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { clsx } from '@/shared/lib/ui';
import {
  ForwardedRef,
  PropsWithChildren,
  ReactNode,
  RefCallback,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import useTransition, { TransitionState } from 'react-transition-state';
import { ignoreClick } from '@/shared/lib/dom';
import { Portal, useZIndex } from '../Utils';

type SelectContext = {
  onSelect: (selected: any) => void;
  scrollIntoViewSelected: boolean;
};

const SelectContext = createContext<SelectContext>({} as any);

export type SelectProps<T> = {
  onClose: () => void;
  inputElement: ReactNode;
  transitionState: TransitionState;
  scrollIntoViewSelected?: boolean;
  onSelect: (selected: T) => void;
  noWrapWithUl?: boolean;
} & PropsWithChildren;

export const Select = withOutsideClickExceptionsContext(function Select<T>({
  children,
  inputElement,
  onClose,
  onSelect,
  noWrapWithUl = false,
  scrollIntoViewSelected = false,
  transitionState: { status, isMounted },
}: SelectProps<T>) {
  const outerRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const zIndex = useZIndex();

  const { width, left, top, recalculatePosition } = usePositionCoords(
    outerRef,
    optionsListRef,
  );

  useClickOutside(optionsListRef, ignoreClick(outerRef, onClose));

  useEffect(() => {
    recalculatePosition();
  }, [recalculatePosition, isMounted]);

  return (
    <SelectContext.Provider
      value={{
        onSelect,
        scrollIntoViewSelected,
      }}
    >
      <div ref={outerRef}>
        {inputElement}
        <Portal>
          {isMounted ? (
            <div
              style={{
                left,
                top,
                width,
                zIndex,
              }}
              className="fixed"
            >
              <div
                ref={optionsListRef}
                className={clsx(
                  'max-h-60 origin-top transform overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-sm transition-[opacity,transform] duration-200 scrollbar-thin scrollbar-thumb-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:scrollbar-thumb-zinc-600',
                  (status === 'preEnter' || status === 'exiting') &&
                    '-translate-y-2 opacity-0',
                )}
              >
                {noWrapWithUl ? children : <ul>{children}</ul>}
              </div>
            </div>
          ) : null}
        </Portal>
      </div>
    </SelectContext.Provider>
  );
});

export type SelectOptionProps<T> = {
  selected: boolean;
  value: T;
} & PropsWithChildren;

export const SelectOption = forwardRef(function SelectOption<T>(
  { children, selected, value }: SelectOptionProps<T>,
  ref: ForwardedRef<HTMLLIElement>,
) {
  const { onSelect, scrollIntoViewSelected } = useContext(SelectContext);

  const scrollIntoViewCallback: RefCallback<HTMLButtonElement> = useCallback(
    elem => {
      if (!elem) {
        return;
      }
      elem.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    },
    [],
  );

  return (
    <li
      className={clsx(
        'border-t border-t-zinc-200 transition duration-75 first:border-t-0 dark:border-t-zinc-800',
        {
          'bg-zinc-100 dark:bg-zinc-900': selected,
          'dark:hover:bg-zinc-900': !selected,
        },
      )}
      ref={ref}
    >
      <button
        type="button"
        className="w-full select-none overflow-hidden overflow-ellipsis whitespace-nowrap px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-200"
        onClick={() => onSelect(value)}
        ref={scrollIntoViewSelected && selected ? scrollIntoViewCallback : null}
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
