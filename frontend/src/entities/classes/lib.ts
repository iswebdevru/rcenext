import { ClassesSchedulePeriod, WeekDay, WeekType } from '@/shared/api';
import { defaultPeriods } from './constants';
import {
  formatDate,
  getAppDate,
  getWeekDay,
  getWeekType,
} from '@/shared/lib/date';

export function withBlankPeriods(periods: ClassesSchedulePeriod[]) {
  return defaultPeriods.map(period => {
    const existing = periods.find(p => p.index === period.index);
    if (existing) {
      return structuredClone(existing);
    }
    return structuredClone(period);
  });
}

export type ClassesQueryParamsOptions = {
  type?: 'mixed' | 'changes' | 'main' | null;
  weekType?: WeekType | null;
  weekDay?: WeekDay | null;
  date?: string | null;
  groupName?: string | null;
  block?: string | null;
  cabinet?: string | null;
};

export function getClassesScheduleSearchParams(
  params: ClassesQueryParamsOptions,
) {
  let date = params.date ? new Date(params.date) : new Date(getAppDate());
  if (date.toString() === 'Invalid Date') {
    date = new Date(getAppDate());
  }

  const filled = {
    type: params.type ?? 'mixed',
    date: formatDate(date),
    groupName: params.groupName ?? '',
    block: params.block ?? -1,
    cabinet: params.cabinet ?? '',
    weekDay: params.weekDay ?? getWeekDay(date),
    weekType: params.weekType ?? getWeekType(date),
  };

  const urlParams = new URLSearchParams({
    type: filled.type,
    group__name: filled.groupName,
    block: filled.block.toString(),
    cabinet: filled.cabinet,
  });
  if (filled.type === 'main') {
    urlParams.append('week_type', filled.weekType);
    urlParams.append('week_day', filled.weekDay);
  } else {
    urlParams.append('date', filled.date);
  }
  return urlParams.toString();
}
