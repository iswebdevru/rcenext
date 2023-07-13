import { WeekDay, WeekType } from '../api';
import { APP_TIMEZONE } from '../constants';

const baseTimestamp = new Date(2000, 0, 3);
const DAY = 86400000;

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getWeekType(date: Date): WeekType {
  return ((date.getTime() - baseTimestamp.getTime()) / DAY) % 14 < 7
    ? 'ЗНАМ'
    : 'ЧИСЛ';
}

export const WEEKDAYS_MAP: WeekDay[] = [
  'ВС',
  'ПН',
  'ВТ',
  'СР',
  'ЧТ',
  'ПТ',
  'СБ',
];

export function getAppDate() {
  return new Date(
    new Date().toLocaleDateString('en', {
      timeZone: APP_TIMEZONE,
    }),
  );
}
