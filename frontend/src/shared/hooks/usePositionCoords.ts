import { RefObject, useCallback, useEffect, useState } from 'react';
import { useEvent } from './useEvent';

const OFFSET = 8;

export function usePositionCoords(
  refToTrack: RefObject<HTMLElement>,
  refToCoordinate: RefObject<HTMLElement>,
) {
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const recalculatePosition = useCallback(() => {
    if (!refToTrack.current) {
      return;
    }
    const refToTrackRect = refToTrack.current.getBoundingClientRect();
    const refToCoordinateRect =
      refToCoordinate.current?.getBoundingClientRect();
    setWidth(refToTrackRect.width);
    if (refToCoordinateRect) {
      setLeft(
        refToTrackRect.x -
          (refToCoordinateRect.width - refToTrackRect.width) / 2,
      );
      setTop(
        document.body.clientHeight - refToTrackRect.bottom >
          refToCoordinateRect.height
          ? refToTrackRect.bottom + OFFSET
          : refToTrackRect.top - OFFSET - refToCoordinateRect.height,
      );
    } else {
      setLeft(refToTrackRect.x);
      setTop(refToTrackRect.bottom + OFFSET);
    }
  }, [refToTrack, refToCoordinate]);

  useEffect(() => {
    recalculatePosition();
  }, [recalculatePosition]);

  useEvent('scroll', recalculatePosition, undefined, true);
  useEvent('resize', recalculatePosition);

  return { width, left, top, recalculatePosition };
}
