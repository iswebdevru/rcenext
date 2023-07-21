import { Select, SelectOption, useSelectTransition } from './Select';
import { Button } from '../Controls';
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
  const [transitionState, toggleTransition] = useSelectTransition();

  return (
    <Select<WeekDay>
      onSelect={dayId => {
        toggleTransition(false);
        onSelect(dayId);
      }}
      onClose={() => toggleTransition(false)}
      transitionState={transitionState}
      inputElement={
        <Button
          type="button"
          variant="common"
          className="min-w-[120px]"
          onClick={() => toggleTransition(true)}
        >
          {WEEK_DAYS.get(weekDayId)}
        </Button>
      }
    >
      {[...WEEK_DAYS.entries()].map(([id, value]) => (
        <SelectOption key={id} selected={weekDayId === id} value={id}>
          {value}
        </SelectOption>
      ))}
    </Select>
  );
}
