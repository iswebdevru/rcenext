import { useRef } from 'react';
import { Button } from '../Controls/Button';
import { Calendar, CalendarProps } from './Calendar';
import { clsx } from '@/shared/lib/ui';
import {
  useClickOutside,
  usePositionCoords,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import useTransition from 'react-transition-state';
import { Portal, useZIndex } from '../Utils';
import { ignoreClick } from '@/shared/lib/dom';

export type DateFieldProps = CalendarProps;

export const DateField = withOutsideClickExceptionsContext<DateFieldProps>(
  function DateField({ date, onDateChange: setDate, disabled }) {
    const outerRef = useRef<HTMLDivElement>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const [{ status, isMounted }, toggleTransition] = useTransition({
      timeout: 200,
      mountOnEnter: true,
      unmountOnExit: true,
      preEnter: true,
    });

    const { left, width, top, recalculatePosition } =
      usePositionCoords(outerRef);

    const zIndex = useZIndex();

    const closeCalendar = () => {
      toggleTransition(false);
    };

    const openCalendar = () => {
      toggleTransition();
      recalculatePosition();
    };

    useClickOutside(componentRef, ignoreClick(outerRef, closeCalendar));

    return (
      <div ref={outerRef}>
        <Button onClick={openCalendar} disabled={disabled}>
          {date.toLocaleDateString('ru')}
        </Button>
        <Portal>
          {isMounted ? (
            <div
              ref={componentRef}
              style={
                {
                  zIndex,
                  '--tw-translate-x': componentRef.current
                    ? `${
                        left - (componentRef.current!.clientWidth - width) / 2
                      }px`
                    : undefined,
                  '--tw-translate-y': `${top}px`,
                } as React.CSSProperties
              }
              className="fixed left-0 top-0 transform"
            >
              <div
                className={clsx(
                  'rounded-xl shadow-sm transition-[opacity,transform] duration-200',
                  (status === 'exiting' || status === 'preEnter') &&
                    '-translate-y-12 scale-75 opacity-0',
                )}
              >
                <Calendar date={date} onDateChange={setDate} />
              </div>
            </div>
          ) : null}
        </Portal>
      </div>
    );
  },
);
