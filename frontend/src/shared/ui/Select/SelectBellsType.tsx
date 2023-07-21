import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Controls';

export const BELLS_TYPES = {
  normal: 'Основной',
  reduced: 'Сокращенный',
} as const;

export type BellsType = keyof typeof BELLS_TYPES;

export type SelectBellsTypeProps = {
  type: BellsType;
  onChange: (type: BellsType) => void;
};

export function SelectBellsType({ type, onChange }: SelectBellsTypeProps) {
  const [transitionState, toggleTransition] = useSelectTransition();

  return (
    <Select<BellsType>
      onSelect={onChange}
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <Button type="button" onClick={() => toggleTransition(true)}>
          {BELLS_TYPES[type]}
        </Button>
      }
    >
      {Object.entries(BELLS_TYPES).map(([key, value]) => (
        <SelectOption key={key} selected={type === key} value={key}>
          {value}
        </SelectOption>
      ))}
    </Select>
  );
}
