import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { forwardRef } from 'react';
import { getDaysAroundCurrentMonth, HUMAN_READABLE_MONTHS } from './lib';

export type CalendarProps = {
  date: Date | null;
  onDateChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarComponent({ date, onDateChange, className, disabled }, ref) {
    if (!date) {
      return null;
    }

    const currentMonth = date.getMonth() as keyof typeof HUMAN_READABLE_MONTHS;
    const currentDate = date.getDate();
    const currentYear = date.getFullYear();
    const days = getDaysAroundCurrentMonth(date);

    return (
      <div
        ref={ref}
        className={classNameWithDefaults(
          'overflow-hidden rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800',
          className
        )}
      >
        <div className="mb-3 flex items-center justify-between px-2 py-1">
          <p className="text-lg font-bold text-slate-900 dark:text-zinc-200">
            {HUMAN_READABLE_MONTHS[currentMonth]} {currentYear}
          </p>
          <div className="flex gap-4">
            <button
              disabled={disabled}
              className="text-2xl font-bold"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth((currentMonth + 11) % 12);
                onDateChange(newDate);
              }}
            >
              {'<'}
            </button>
            <button
              disabled={disabled}
              className="text-2xl font-bold"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth((currentMonth + 1) % 12);
                onDateChange(newDate);
              }}
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 justify-center gap-2 text-sm">
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            ПН
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            ВТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            СР
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            ЧТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            ПТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            СБ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-400">
            ВС
          </div>
          {days.map(day => (
            <button
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(day.date);
                onDateChange(newDate);
              }}
              key={`${day.date}-${day.month}`}
              disabled={
                day.month !== currentMonth ||
                (day.month === currentMonth && day.date === currentDate) ||
                disabled
              }
              className={clsx({
                'aspect-square select-none rounded-lg p-1.5 text-center leading-none outline-none outline outline-1 outline-offset-0 transition-[outline,color,background]':
                  true,
                'text-zinc-700 hover:bg-zinc-200 focus:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700':
                  day.month === currentMonth && day.date !== currentDate,
                'text-zinc-300 dark:text-zinc-600': day.month !== currentMonth,
                'bg-blue-50 text-blue-400 outline-blue-400 dark:bg-blue-600 dark:text-blue-50 dark:outline-transparent':
                  day.month === currentMonth && day.date === currentDate,
              })}
            >
              {day.date}
            </button>
          ))}
        </div>
      </div>
    );
  }
);
