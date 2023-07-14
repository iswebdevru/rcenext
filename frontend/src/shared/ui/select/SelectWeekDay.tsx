import {
  SelectBeta,
  SelectBetaOption,
  useSelectTransition,
} from './SelectBeta';
import { Button } from '../controls';
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
    <SelectBeta
      onClose={() => toggleTransition(false)}
      transitionState={transitionState}
      inputElement={
        <Button
          variant="common"
          className="min-w-[120px]"
          onClick={() => toggleTransition(true)}
        >
          {WEEK_DAYS.get(weekDayId)}
        </Button>
      }
    >
      {[...WEEK_DAYS.entries()].map(([id, value]) => (
        <SelectBetaOption
          onSelect={() => {
            toggleTransition(false);
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
