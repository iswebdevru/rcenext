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
} & PropsWithChildren;

export const Select = withOutsideClickExceptionsContext(function Select<T>({
  children,
  inputElement,
  onClose,
  onSelect,
  scrollIntoViewSelected = false,
  transitionState: { status, isMounted },
}: SelectProps<T>) {
  const outerRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const zIndex = useZIndex();

  const { width, left, top } = usePositionCoords(outerRef, [isMounted]);

  useClickOutside(optionsListRef, ignoreClick(outerRef, onClose));

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
        'border-b border-b-zinc-200 last:border-b-0 dark:border-b-zinc-700',
        {
          'bg-zinc-100 dark:bg-zinc-700': selected,
        },
      )}
      ref={ref}
    >
      <button
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
