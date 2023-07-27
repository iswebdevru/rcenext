import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Controls';

export const BELLS_VARIANTS = {
  normal: 'Основной',
  reduced: 'Сокращенный',
} as const;

export type BellsScheduleVariant = keyof typeof BELLS_VARIANTS;

export type SelectBellsTypeProps = {
  variant: BellsScheduleVariant;
  onChange: (variant: BellsScheduleVariant) => void;
};

export function SelectBellsScheduleVariant({
  variant,
  onChange,
}: SelectBellsTypeProps) {
  const [transitionState, toggleTransition] = useSelectTransition();

  return (
    <Select<BellsScheduleVariant>
      onSelect={onChange}
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <Button type="button" onClick={() => toggleTransition(true)}>
          {BELLS_VARIANTS[variant]}
        </Button>
      }
    >
      {Object.entries(BELLS_VARIANTS).map(([key, value]) => (
        <SelectOption key={key} selected={variant === key} value={key}>
          {value}
        </SelectOption>
      ))}
    </Select>
  );
}
