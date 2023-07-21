import { WEEK_TYPES } from '@/shared/constants';
import { WeekType } from '@/shared/api';
import { Select, SelectOption, useSelectTransition } from './Select';
import { Button } from '../Controls';

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
    <Select<WeekType>
      onSelect={id => {
        onSelect(id);
        toggleTransition(false);
      }}
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <Button
          type="button"
          className="min-w-[120px]"
          onClick={() => toggleTransition(true)}
        >
          {WEEK_TYPES.get(weekTypeId)}
        </Button>
      }
    >
      {[...WEEK_TYPES.entries()].map(([id, value]) => (
        <SelectOption key={id} selected={weekTypeId === id} value={id}>
          {value}
        </SelectOption>
      ))}
    </Select>
  );
}
