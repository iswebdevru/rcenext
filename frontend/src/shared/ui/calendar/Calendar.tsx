import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { Dispatch, SetStateAction, forwardRef } from 'react';
import { getDaysAroundCurrentMonth, HUMAN_READABLE_MONTHS } from './lib';

export type CalendarProps = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  className?: string;
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarComponent({ date, setDate, className }, ref) {
    const currentMonth = date.getMonth() as keyof typeof HUMAN_READABLE_MONTHS;
    const currentDate = date.getDate();
    const currentYear = date.getFullYear();
    const days = getDaysAroundCurrentMonth(date);

    return (
      <div
        ref={ref}
        className={classNameWithDefaults(
          'p-3 bg-white border rounded-lg border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 overflow-hidden',
          className
        )}
      >
        <div className="flex items-center justify-between px-2 py-1 mb-3">
          <p className="text-lg font-bold text-slate-900 dark:text-zinc-200">
            {HUMAN_READABLE_MONTHS[currentMonth]} {currentYear}
          </p>
          <div className="flex gap-4">
            <button
              className="text-2xl font-bold"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth((currentMonth + 11) % 12);
                setDate(newDate);
              }}
            >
              {'<'}
            </button>
            <button
              className="text-2xl font-bold"
              onClick={() => {
                const newDate = new Date(date);
                newDate.setMonth((currentMonth + 1) % 12);
                setDate(newDate);
              }}
            >
              {'>'}
            </button>
          </div>
        </div>
        <div className="grid justify-center grid-cols-7 gap-2 text-sm">
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            ПН
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            ВТ
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            СР
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            ЧТ
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            ПТ
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            СБ
          </div>
          <div className="pb-2 font-semibold text-center text-zinc-900 dark:text-zinc-400">
            ВС
          </div>
          {days.map(day => (
            <button
              onClick={() => {
                const newDate = new Date(date);
                newDate.setDate(day.date);
                setDate(newDate);
              }}
              key={`${day.date}-${day.month}`}
              disabled={
                day.month !== currentMonth ||
                (day.month === currentMonth && day.date === currentDate)
              }
              className={clsx({
                'rounded-lg outline-none outline-1 outline-offset-0 select-none outline leading-none aspect-square text-center p-1.5 transition-[outline,color,background]':
                  true,
                'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:bg-zinc-200 dark:focus:bg-zinc-700':
                  day.month === currentMonth && day.date !== currentDate,
                'text-zinc-300 dark:text-zinc-600': day.month !== currentMonth,
                'outline-blue-400 bg-blue-50 text-blue-400 dark:bg-blue-600 dark:outline-transparent dark:text-blue-50':
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
