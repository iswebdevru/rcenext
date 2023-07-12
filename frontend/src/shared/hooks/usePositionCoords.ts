import { RefObject, useCallback, useState } from 'react';
import { useEvent } from './useEvent';

const MAX_HEIGHT = 240;
const OFFSET = 8;

export function usePositionCoords(ref: RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const recalculatePosition = useCallback(() => {
    if (!ref.current) {
      return;
    }
    const componentRect = ref.current.getBoundingClientRect();
    setWidth(componentRect.width);
    setLeft(componentRect.x);
    setTop(
      document.body.clientHeight - componentRect.bottom <
        MAX_HEIGHT + OFFSET * 2
        ? componentRect.top - MAX_HEIGHT - OFFSET
        : componentRect.bottom + OFFSET,
    );
  }, [ref]);

  useEvent('scroll', recalculatePosition, undefined, true);
  useEvent('resize', recalculatePosition);

  return { width, left, top, recalculatePosition };
}
