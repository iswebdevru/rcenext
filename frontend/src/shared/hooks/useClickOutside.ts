import { MutableRefObject } from 'react';
import { useEvent } from './useEvent';
import { ignoreClick } from '../lib/dom';

export function useClickOutside(
  ref: MutableRefObject<HTMLElement | null>,
  onClick: (e: MouseEvent) => void,
) {
  useEvent('click', ignoreClick(ref.current, onClick));
}
