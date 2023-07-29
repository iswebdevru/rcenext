import { ClassesSchedulePeriod } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { NextServerURLSearchParams } from '@/shared/packages/next';
import {
  prepareDate,
  prepareWeekDay,
  prepareWeekType,
} from '@/shared/lib/filters';
import { defaultPeriods } from './constants';
import { prepareBlock, prepareType } from './filters';

export function withBlankPeriods(periods: ClassesSchedulePeriod[]) {
  return defaultPeriods.map(period => {
    const existing = periods.find(p => p.index === period.index);
    if (existing) {
      return structuredClone(existing);
    }
    return structuredClone(period);
  });
}

export function getClassesScheduleSearchParams(
  searchParams: NextServerURLSearchParams,
) {
  return new URLSearchParams({
    type: prepareType(searchParams.type),
    date: formatDate(prepareDate(searchParams.date)),
    group__name: searchParams.group__name?.toString() ?? '',
    block: prepareBlock(searchParams.block),
    cabinet: searchParams.cabinet?.toString() ?? '',
    week_day: prepareWeekDay(searchParams.week_day),
    week_type: prepareWeekType(searchParams.week_type),
  });
}
