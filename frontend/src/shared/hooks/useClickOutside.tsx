import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useEvent } from './useEvent';

type OutsideClickExceptionsContext = {
  exceptions: Readonly<MutableRefObject<Set<RefObject<Node>>>>;
  push: (ref: RefObject<Node>) => void;
  remove: (ref: RefObject<Node>) => void;
};

const OutsideClickExceptionsContext =
  createContext<OutsideClickExceptionsContext | null>(null);

export function useClickOutside(
  ref: RefObject<Node>,
  onClick: (e: MouseEvent) => void,
) {
  const ctx = useContext(OutsideClickExceptionsContext);

  const handler = (e: MouseEvent) => {
    if (
      !ctx ||
      [...ctx.exceptions.current].every(exception => {
        return (
          !(e.target instanceof Node) ||
          !exception.current ||
          !exception.current.contains(e.target)
        );
      })
    ) {
      onClick(e);
    }
  };

  useEvent('click', handler);
  useRegisterOutsideClickException(ref);
}

export function withOutsideClickExceptionsContext<T>(
  UserComponent: (props: T) => ReactNode,
) {
  return function Component(props: T) {
    return (
      <OutsideClickExceptionsContextProvider>
        <UserComponent {...(props as any)} />
      </OutsideClickExceptionsContextProvider>
    );
  };
}

export function useRegisterOutsideClickException(ref: RefObject<Node>) {
  const ctx = useContext(OutsideClickExceptionsContext);

  if (!ctx) {
    throw new Error(
      'You must wrap a parent in <OutsideClickExceptionsContextProvider /> in order to use this hook',
    );
  }

  const { push, remove } = ctx;

  useEffect(() => {
    push(ref);
    return () => remove(ref);
  }, [push, remove, ref]);
}

function OutsideClickExceptionsContextProvider({
  children,
}: PropsWithChildren) {
  const parentContext = useContext(OutsideClickExceptionsContext);
  const exceptions = useRef(new Set<RefObject<Node>>());

  const push = useCallback(
    (ref: RefObject<Node>) => {
      exceptions.current.add(ref);
      if (parentContext?.exceptions) {
        parentContext.push(ref);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const remove = useCallback(
    (ref: RefObject<Node>) => {
      if (parentContext?.exceptions) {
        parentContext.remove(ref);
      }
      exceptions.current.delete(ref);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <OutsideClickExceptionsContext.Provider
      value={{ exceptions, push, remove }}
    >
      {children}
    </OutsideClickExceptionsContext.Provider>
  );
}
