import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { openSans } from './fonts';

/**
 * Render children outside of application root.
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
