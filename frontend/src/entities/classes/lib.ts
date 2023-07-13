import { ClassesSchedulePeriod, WeekDay, WeekType } from '@/shared/api';
import { defaultPeriods } from './constants';

export function withBlankPeriods(periods: ClassesSchedulePeriod[]) {
  return defaultPeriods.map(period => {
    const existing = periods.find(p => p.index === period.index);
    if (existing) {
      return structuredClone(existing);
    }
    return structuredClone(period);
  });
}

export type ClassesQueryParamsOptions = (
  | {
      classesType: 'main';
      weekType: WeekType;
      weekDay: WeekDay;
    }
  | {
      classesType: 'mixed' | 'changes';
      date: string;
    }
) & {
  groupName: string;
  collegeBlock: number;
  cabinet: string;
};

export function getClassesQueryParams(params: ClassesQueryParamsOptions) {
  return `?type=${params.classesType}&group__name=${params.groupName}&block=${
    params.collegeBlock
  }&cabinet=${params.cabinet}${
    params.classesType === 'main'
      ? `&week_type=${params.weekType}&week_day=${params.weekDay}`
      : `&date=${params.date}`
  }`;
}
