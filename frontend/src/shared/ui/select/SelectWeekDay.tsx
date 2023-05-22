import { useState } from 'react';
import { SelectBeta, SelectBetaOption } from './SelectBeta';
import { Button } from '../Button';
import { WEEK_DAYS } from '@/shared/constants';
import { WeekDay } from '@/shared/api';

export type SelectWeekDayProps<T extends WeekDay> = {
  weekDayId: T;
  onSelect: (weekDayId: WeekDay) => void;
};

export function SelectWeekDay<T extends WeekDay>({
  weekDayId,
  onSelect,
}: SelectWeekDayProps<T>) {
  const [isRevealed, setIsRevealed] = useState(false);
  return (
    <SelectBeta
      onClose={() => setIsRevealed(false)}
      isRevealed={isRevealed}
      inputElement={
        <Button
          variant="common"
          className="min-w-[120px]"
          onClick={() => setIsRevealed(true)}
        >
          {WEEK_DAYS.get(weekDayId)}
        </Button>
      }
    >
      {[...WEEK_DAYS.entries()].map(([id, value]) => (
        <SelectBetaOption
          onSelect={() => {
            setIsRevealed(false);
            onSelect(id);
          }}
          key={id}
          selected={weekDayId === id}
        >
          {value}
        </SelectBetaOption>
      ))}
    </SelectBeta>
  );
}
