import { clsx } from '@/shared/lib/ui';
import { Dispatch, SetStateAction } from 'react';
import { getDaysAroundCurrentMonth, HUMAN_READABLE_MONTHS } from './lib';

export type CalendarProps = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

export function Calendar({ date, setDate }: CalendarProps) {
  const currentMonth = date.getMonth() as keyof typeof HUMAN_READABLE_MONTHS;
  const currentDate = date.getDate();
  const currentYear = date.getFullYear();
  const days = getDaysAroundCurrentMonth(date);

  return (
    <div className="p-3 bg-white border rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between px-2 py-1 mb-3">
        <p className="text-lg font-bold text-slate-900 dark:text-slate-200">
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
      <div className="grid justify-center grid-cols-7 gap-2">
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          ПН
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          ВТ
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          СР
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          ЧТ
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          ПТ
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
          СБ
        </div>
        <div className="pb-2 text-sm font-semibold text-center text-slate-900 dark:text-slate-400">
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
            disabled={day.month !== currentMonth}
            className={clsx({
              'rounded-lg leading-none aspect-square text-center p-1.5': true,
              'text-slate-900 dark:text-slate-200': day.month === currentMonth,
              'hover:bg-slate-200 dark:hover:bg-blue-500':
                day.month === currentMonth && day.date !== currentDate,
              'text-slate-300 dark:text-slate-600': day.month !== currentMonth,
              'bg-slate-300 dark:bg-blue-600':
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
