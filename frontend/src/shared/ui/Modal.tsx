import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { openSans } from './fonts';
import { CSSTransition } from 'react-transition-group';

/**
 * Low level API. The base primitive of every modal in application.
 * Inspired by "Айти Синяк"
 */
export function Portal({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = document.getElementById('__next')!;
    containerRef.current = document.createElement('div');
    containerRef.current.classList.add(openSans.variable, 'font-sans');
    root.append(containerRef.current);
    return () => {
      root.removeChild(containerRef.current!);
    };
  }, []);

  if (!containerRef.current) {
    return null;
  }

  return createPortal(children, containerRef.current);
}

export function Overlay({ children }: PropsWithChildren) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition nodeRef={nodeRef} timeout={200}>
      <div
        className="fixed left-0 top-0 w-full h-full bg-zinc-900 bg-opacity-80 z-20 grid place-items-center"
        ref={nodeRef}
      >
        {children}
      </div>
    </CSSTransition>
  );
}

export type ModalProps = {
  isOpened: boolean;
  onChange: (state: boolean) => void;
} & PropsWithChildren;
export function Modal({ children }: PropsWithChildren) {
  return (
    <Portal>
      <Overlay>{children}</Overlay>
    </Portal>
  );
}
