'use client';

import { clsx } from '@/shared/lib/ui';
import { Dispatch, SetStateAction, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../Controls';
import { DAY, getDaysAroundCurrentMonth } from '@/shared/lib/date';
import { SelectYear } from '../Select';
import { HUMAN_READABLE_MONTHS } from '@/shared/lib/human';

export type CalendarProps = {
  date: Date;
  onDateChange: Dispatch<SetStateAction<Date>>;
  className?: string;
  disabled?: boolean;
};

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function CalendarComponent({ date, onDateChange, className, disabled }, ref) {
    const currentMonth = date.getMonth() as keyof typeof HUMAN_READABLE_MONTHS;
    const currentDate = date.getDate();

    const days = getDaysAroundCurrentMonth(date);

    return (
      <div
        ref={ref}
        className={clsx(
          'space-y-4 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950',
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div>
            <Button type="button" onClick={() => onDateChange(new Date())}>
              Сегодня
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => onDateChange(new Date(Date.now() + DAY))}
            >
              Завтра
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={disabled}
            className="h-8 w-8 rounded-xl border border-zinc-200 text-zinc-900 shadow-sm shadow-zinc-900/5 transition-colors hover:bg-zinc-100 dark:border-none dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-zinc-900/30 dark:hover:bg-zinc-800"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setMonth((currentMonth + 11) % 12);
              onDateChange(newDate);
            }}
          >
            <FontAwesomeIcon fixedWidth icon={faAngleLeft} />
          </button>
          <div className="grow">
            <SelectYear date={date} onChange={onDateChange} />
          </div>
          <button
            type="button"
            disabled={disabled}
            className="h-8 w-8 rounded-xl border border-zinc-200 text-zinc-900 shadow-sm shadow-zinc-900/5 transition-colors hover:bg-zinc-100 dark:border-none dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-zinc-900/30 dark:hover:bg-zinc-800"
            onClick={() => {
              const newDate = new Date(date);
              newDate.setMonth((currentMonth + 1) % 12);
              onDateChange(newDate);
            }}
          >
            <FontAwesomeIcon fixedWidth icon={faAngleRight} />
          </button>
        </div>
        <div className="grid grid-cols-7 justify-center gap-2 text-sm">
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            ПН
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            ВТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            СР
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            ЧТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            ПТ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            СБ
          </div>
          <div className="pb-2 text-center font-semibold text-zinc-900 dark:text-zinc-500">
            ВС
          </div>
          {days.map(day => (
            <button
              type="button"
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
              className={clsx(
                'aspect-square select-none rounded-lg p-1.5 text-center leading-none transition-colors duration-75',
                {
                  'text-zinc-700 hover:bg-zinc-100 focus:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white dark:focus:bg-zinc-700':
                    day.month === currentMonth && day.date !== currentDate,
                  'text-zinc-300 dark:text-zinc-400/30':
                    day.month !== currentMonth,
                  'bg-blue-50 text-blue-400 outline-blue-400 ring-1 ring-inset ring-primary-400 dark:bg-primary-600 dark:text-white dark:outline-transparent dark:ring-transparent':
                    day.month === currentMonth && day.date === currentDate,
                },
              )}
            >
              {day.date}
            </button>
          ))}
        </div>
      </div>
    );
  },
);
