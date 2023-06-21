import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { openSans } from './fonts';
import { CSSTransition } from 'react-transition-group';

/**
 * Low level API. The base primitive of every modal in the application.
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

export type OverlayProps = {
  isVisible: boolean;
} & PropsWithChildren;

export function Overlay({ children, isVisible }: OverlayProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      timeout={150}
      in={isVisible}
      unmountOnExit
      classNames={{
        enter: 'opacity-0',
        enterActive: 'opacity-100 transition-opacity',
        exit: 'opacity-1',
        exitActive: 'opacity-0 transition-opacity',
      }}
    >
      <div
        className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-70 z-20 grid place-items-center"
        ref={nodeRef}
      >
        {children}
      </div>
    </CSSTransition>
  );
}
