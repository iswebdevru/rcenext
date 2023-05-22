import { WEEK_TYPES } from '@/shared/constants';
import { SelectBeta, SelectBetaOption } from './SelectBeta';
import { Button } from '../Button';
import { useState } from 'react';

export type SelectWeekTypeProps = {
  weekTypeId: string;
  onSelect: (id: string) => void;
};

export function SelectWeekType({ weekTypeId, onSelect }: SelectWeekTypeProps) {
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
