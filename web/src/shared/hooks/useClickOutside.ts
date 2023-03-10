import { MutableRefObject, useEffect } from 'react';

export function useClickOutside(
  ref: MutableRefObject<HTMLElement | null>,
  onClick: (e: MouseEvent) => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || !(e.target instanceof HTMLElement)) {
        return;
      }
      if (!ref.current.contains(e.target)) {
        onClick(e);
      }
    };
    window.addEventListener('click', listener);
    return () => {
      window.removeEventListener('click', listener);
    };
  }, [ref, onClick]);
}
