import { WeekDay, WeekType } from '../api';
import { WEEK_DAYS_SHORT, WEEK_TYPES } from '../constants';
import { getAppDate, getWeekTypeFromDate } from './date';
import { getWeekDayExcerpt } from './human';

export function prepareWeekDay(data: unknown) {
  return typeof data === 'string' && WEEK_DAYS_SHORT.includes(data as WeekDay)
    ? data
    : getWeekDayExcerpt(new Date(getAppDate()));
}

export function prepareDate(data: unknown) {
  if (
    typeof data !== 'string' &&
    typeof data !== 'number' &&
    !(data instanceof Date)
  ) {
    return new Date(getAppDate());
  }
  const date = new Date(data);
  if (date.toString() === 'Invalid Date') {
    return new Date(getAppDate());
  }
  return date;
}

export function prepareWeekType(data: unknown) {
  return typeof data === 'string' && WEEK_TYPES.has(data as WeekType)
    ? data
    : getWeekTypeFromDate(new Date(getAppDate()));
}
