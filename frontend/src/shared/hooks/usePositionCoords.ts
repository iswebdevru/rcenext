import { RefObject, useCallback, useState } from 'react';
import { useEvent } from './useEvent';

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
    setTop(componentRect.bottom);
  }, [ref]);

  useEvent('scroll', recalculatePosition, undefined, true);
  useEvent('resize', recalculatePosition);

  return { width, left, top, recalculatePosition };
}
