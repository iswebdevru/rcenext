import { Toggles, TogglesProps } from '@/shared/ui/Toggles';

/**
 * -1 - All blocks selected
 *
 *  1 - 1-5th blocks selected
 *
 *  6 - Only 6th block selected
 */
export type CollegeBlock = -1 | 1 | 6;

export function CollegeBlockToggles(props: TogglesProps<CollegeBlock>) {
  return (
    <Toggles {...props}>
      <Toggles.Variant value={-1}>Все</Toggles.Variant>
      <Toggles.Variant value={1}>1-5</Toggles.Variant>
      <Toggles.Variant value={6}>6</Toggles.Variant>
    </Toggles>
  );
}
