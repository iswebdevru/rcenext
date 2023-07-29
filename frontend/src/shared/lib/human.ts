import { WeekType } from '../api';
import { HUMAN_MONTHS, WEEK_DAYS_SHORT, WEEK_TYPES } from '../constants';

export const HUMAN_READABLE_MONTHS = {
  0: 'Январь',
  1: 'Февраль',
  2: 'Март',
  3: 'Апрель',
  4: 'Май',
  5: 'Июнь',
  6: 'Июль',
  7: 'Август',
  8: 'Сентябрь',
  9: 'Октябрь',
  10: 'Ноябрь',
  11: 'Декабрь',
} as const;

export function getWeekDayExcerpt(date: Date) {
  return WEEK_DAYS_SHORT[date.getDay()];
}

export function getHumanMonth(date: Date) {
  return HUMAN_MONTHS[date.getMonth()];
}

export function getHumanWeekType(weekType: WeekType) {
  return WEEK_TYPES.get(weekType)!;
}
