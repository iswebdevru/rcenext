import { WEEK_TYPES } from '@/shared/constants';
import { WeekType } from '@/shared/api';
import {
  SelectBeta,
  SelectBetaOption,
  useSelectTransition,
} from './SelectBeta';
import { Button } from '../controls';

export type SelectWeekTypeProps<T extends WeekType> = {
  weekTypeId: T;
  onSelect: (id: WeekType) => void;
};

export function SelectWeekType<T extends WeekType>({
  weekTypeId,
  onSelect,
}: SelectWeekTypeProps<T>) {
  const [transitionState, toggleTransition] = useSelectTransition();

  return (
    <SelectBeta
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <Button
          className="min-w-[120px]"
          onClick={() => toggleTransition(true)}
        >
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
            toggleTransition(false);
          }}
        >
          {value}
        </SelectBetaOption>
      ))}
    </SelectBeta>
  );
}
