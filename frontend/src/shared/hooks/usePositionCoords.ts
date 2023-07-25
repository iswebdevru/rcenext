import { RefObject, useCallback, useEffect, useState } from 'react';
import { useEvent } from './useEvent';

const OFFSET = 8;

export type UsePositionCoordsOptions = {
  alignCenter?: boolean;
};

export function usePositionCoords(
  refToTrack: RefObject<HTMLElement>,
  refToCoordinate: RefObject<HTMLElement>,
  options?: UsePositionCoordsOptions,
) {
  const [width, setWidth] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [top, setTop] = useState(0);

  const alignCenter = options?.alignCenter ?? true;

  const recalculatePosition = useCallback(() => {
    if (!refToTrack.current) {
      return;
    }
    const refToTrackRect = refToTrack.current.getBoundingClientRect();
    const refToCoordinateRect =
      refToCoordinate.current?.getBoundingClientRect();
    setWidth(refToTrackRect.width);
    if (refToCoordinateRect) {
      if (alignCenter) {
        const diff = Math.abs(
          (refToCoordinateRect.width - refToTrackRect.width) / 2,
        );
        setLeft(refToTrackRect.left - diff);
        setRight(document.body.clientWidth - refToTrackRect.right - diff);
      } else {
        setLeft(refToTrackRect.left);
        setRight(document.body.clientWidth - refToTrackRect.right);
      }
      setTop(
        document.body.clientHeight - refToTrackRect.bottom >
          refToCoordinateRect.height
          ? refToTrackRect.bottom + OFFSET
          : refToTrackRect.top - OFFSET - refToCoordinateRect.height,
      );
    } else {
      setLeft(refToTrackRect.left);
      setRight(document.body.clientWidth - refToTrackRect.right);
      setTop(refToTrackRect.bottom + OFFSET);
    }
  }, [refToTrack, refToCoordinate, alignCenter]);

  useEffect(() => {
    recalculatePosition();
  }, [recalculatePosition]);

  useEvent('scroll', recalculatePosition, undefined, true);
  useEvent('resize', recalculatePosition);

  return { width, left, right, top, recalculatePosition };
}
