import { className } from '@/shared/lib/ui';
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
    <div className="p-2 bg-white border rounded-md">
      <div className="flex items-center justify-between px-1 py-2 mb-4">
        <p className="text-xl font-bold">
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
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          ПН
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          ВТ
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          СР
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          ЧТ
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          ПТ
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
          СБ
        </div>
        <div className="pb-3 text-sm font-semibold text-center text-neutral-900">
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
            className={className({
              'rounded-md leading-none aspect-square text-center p-2': true,
              'text-neutral-900': day.month === currentMonth,
              'hover:bg-slate-100':
                day.month === currentMonth && day.date !== currentDate,
              'text-neutral-300': day.month !== currentMonth,
              'bg-slate-200':
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
