import { useState } from 'react';
import { SelectBeta, SelectBetaOption } from './SelectBeta';
import { Button } from '../Button';
import { WEEK_DAYS } from '@/shared/constants';

export type SelectWeekDayProps = {
  weekDayId: string;
  onSelect: (weekDayId: string) => void;
};

export function SelectWeekDay({ weekDayId, onSelect }: SelectWeekDayProps) {
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
