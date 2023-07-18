import { Dispatch, SetStateAction } from 'react';
import { Select, SelectOption, useSelectTransition } from './Select';
import { HUMAN_READABLE_MONTHS, getYearsAroundDate } from '@/shared/lib/date';

export type SelectYearProps = {
  date: Date;
  onChange: Dispatch<SetStateAction<Date>>;
};

export function SelectYear({ date, onChange }: SelectYearProps) {
  const [transitionState, toggleTransition] = useSelectTransition();

  const years = getYearsAroundDate(date.getFullYear());

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() as keyof typeof HUMAN_READABLE_MONTHS;

  return (
    <Select<number>
      onSelect={year => {
        toggleTransition(false);
        onChange(prev => {
          const clone = new Date(prev);
          clone.setFullYear(year);
          return clone;
        });
      }}
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <button
          onClick={() => toggleTransition()}
          className="w-full text-lg font-bold text-slate-900 dark:text-zinc-300"
        >
          {HUMAN_READABLE_MONTHS[currentMonth]} {currentYear}
        </button>
      }
      scrollIntoViewSelected
    >
      {years.map(year => (
        <SelectOption key={year} selected={currentYear === year} value={year}>
          {HUMAN_READABLE_MONTHS[currentMonth]} {year}
        </SelectOption>
      ))}
    </Select>
  );
}
