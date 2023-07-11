import { useState } from 'react';
import { WEEK_TYPES } from '@/shared/constants';
import { WeekType } from '@/shared/api';
import { SelectBeta, SelectBetaOption } from './SelectBeta';
import { Button } from '../controls';

export type SelectWeekTypeProps<T extends WeekType> = {
  weekTypeId: T;
  onSelect: (id: WeekType) => void;
};

export function SelectWeekType<T extends WeekType>({
  weekTypeId,
  onSelect,
}: SelectWeekTypeProps<T>) {
  const [isRevealed, setIsRevealed] = useState(false);
  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={() => setIsRevealed(false)}
      inputElement={
        <Button className="min-w-[120px]" onClick={() => setIsRevealed(true)}>
          {WEEK_TYPES.get(weekTypeId)}
        </Button>
      }
    >
      {[...WEEK_TYPES.entries()].map(([id, value]) => (
        <SelectBetaOption
          key={id}
          selected={weekTypeId === id}
          onSelect={() => {
            onSelect(id);
            setIsRevealed(false);
          }}
        >
          {value}
        </SelectBetaOption>
      ))}
    </SelectBeta>
  );
}
