import { useRef, useState } from 'react';
import { Button } from '../Button';
import { Calendar, CalendarProps } from './Calendar';
import { clsx } from '@/shared/lib/ui';
import { useClickOutside } from '@/shared/hooks';

export function InputDate({ date, setDate }: CalendarProps) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useClickOutside(componentRef, () => setIsRevealed(false));

  return (
    <div className="relative" ref={componentRef}>
      <Button onClick={() => setIsRevealed(true)}>
        {date.toLocaleDateString()}
      </Button>
      <div
        className={clsx({
          'absolute left-1/2 -translate-x-1/2 top-full mt-3 transition-[opacity,transform] duration-200':
            true,
          'asdf scale-100 opacity-1 translate-y-0': isRevealed,
          'visibility-hidden pointer-events-none -translate-y-12 scale-75 opacity-0':
            !isRevealed,
        })}
      >
        <Calendar
          date={date}
          className="min-w-[280px] shadow-sm"
          setDate={setDate}
        />
      </div>
    </div>
  );
}
