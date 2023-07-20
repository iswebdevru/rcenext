import { BellsPeriodEditing } from './types';

export function isBellsPeriodValid(period: BellsPeriodEditing) {
  return (
    period.period_from &&
    period.period_to &&
    (!period.has_break || (period.period_from_after && period.period_to_after))
  );
}

function _format(time: string) {
  const [_, hh, mm] = time.match(/(\d\d):(\d\d)/)!;
  return `${hh}:${mm}:00`;
}

export function formatPeriodTime(period: BellsPeriodEditing) {
  const clone = { ...period };
  clone.period_from = _format(clone.period_from);
  clone.period_to = _format(clone.period_to);
  if (clone.has_break) {
    clone.period_from_after = _format(clone.period_from_after);
    clone.period_to_after = _format(clone.period_to_after);
  }
  return clone;
}
