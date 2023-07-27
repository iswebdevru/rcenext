import { BellsPeriodEditing } from './types';
import { formatDate, prepareDate, prepareWeekDay } from '@/shared/lib/date';
import { prepareType, prepareVariant } from './validators';
import { NextServerURLSearchParams } from '@/shared/packages/next';

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

export function getBellsScheduleSearchParams(
  searchParams: NextServerURLSearchParams,
) {
  return new URLSearchParams({
    type: prepareType(searchParams.type),
    variant: prepareVariant(searchParams.variant),
    date: formatDate(prepareDate(searchParams.date)),
    week_day: prepareWeekDay(searchParams.weekDay),
  }).toString();
}
