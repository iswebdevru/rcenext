import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Calendar, CalendarProps } from './Calendar';
import { clsx } from '@/shared/lib/ui';
import { useClickOutside } from '@/shared/hooks';

export type InputDateProps = CalendarProps;

export function InputDate({
  date,
  onDateChange: setDate,
  disabled,
}: InputDateProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useClickOutside(componentRef, () => setIsRevealed(false));

  return (
    <div className="relative" ref={componentRef}>
      <Button onClick={() => setIsRevealed(true)} disabled={disabled}>
        {date.toLocaleDateString()}
      </Button>
      <div
        className={clsx({
          'absolute left-1/2 top-full mt-3 -translate-x-1/2 transition-[opacity,transform] duration-200':
            true,
          'asdf opacity-1 z-10 translate-y-0 scale-100': isRevealed,
          'pointer-events-none invisible -translate-y-12 scale-75 opacity-0':
            !isRevealed,
        })}
      >
        <Calendar
          date={date}
          className="min-w-[280px] shadow-sm"
          onDateChange={setDate}
        />
      </div>
    </div>
  );
}
