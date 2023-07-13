import { useRef } from 'react';
import { Button } from '../controls/Button';
import { Calendar, CalendarProps } from './Calendar';
import { clsx } from '@/shared/lib/ui';
import { useClickOutside, usePositionCoords } from '@/shared/hooks';
import useTransition from 'react-transition-state';
import { Portal, useZIndex } from '../utils';
import { ignoreClick } from '@/shared/lib/dom';

export type InputDateProps = CalendarProps;

export function InputDate({
  date,
  onDateChange: setDate,
  disabled,
}: InputDateProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const [{ status, isMounted }, toggleTransition] = useTransition({
    timeout: 200,
    mountOnEnter: true,
    unmountOnExit: true,
    preEnter: true,
  });

  const { left, width, top, recalculatePosition } = usePositionCoords(outerRef);

  const zIndex = useZIndex();

  const closeCalendar = () => {
    toggleTransition(false);
  };

  const openCalendar = () => {
    toggleTransition();
    recalculatePosition();
  };

  useClickOutside(componentRef, ignoreClick(outerRef.current, closeCalendar));

  return (
    <div ref={outerRef}>
      <Button onClick={openCalendar} disabled={disabled}>
        {date.toLocaleDateString('ru')}
      </Button>
      <Portal>
        {isMounted ? (
          <div
            ref={componentRef}
            style={{
              zIndex,
              left: componentRef.current
                ? left - (componentRef.current!.clientWidth - width) / 2
                : undefined,
              top,
            }}
            className={clsx({
              'fixed rounded-xl shadow-sm transition-[opacity,transform] duration-200':
                true,
              'translate-y-0 scale-100 opacity-100': status === 'entering',
              '-translate-y-12 scale-75 opacity-0':
                status === 'exiting' || status === 'preEnter',
            })}
          >
            <Calendar
              date={date}
              className="min-w-[280px] shadow-sm"
              onDateChange={setDate}
            />
          </div>
        ) : null}
      </Portal>
    </div>
  );
}
