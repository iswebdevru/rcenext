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
  groupSearch: string;
  collegeBlock: number;
};

export function getClassesQueryParams(params: ClassesQueryParamsOptions) {
  return `?type=${params.classesType}&search=${params.groupSearch}&block=${
    params.collegeBlock
  }${
    params.classesType === 'main'
      ? `&week_type=${params.weekType}&week_day=${params.weekDay}`
      : `&date=${params.date}`
  }`;
}
