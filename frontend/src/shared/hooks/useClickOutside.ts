import { MutableRefObject } from 'react';
import { useEvent } from './useEvent';

export function useClickOutside(
  ref: MutableRefObject<HTMLElement | null>,
  onClick: (e: MouseEvent) => void,
) {
  useEvent('click', e => {
    if (!ref.current || !(e.target instanceof HTMLElement)) {
      return;
    }
    if (!ref.current.contains(e.target)) {
      onClick(e);
    }
  });
}
