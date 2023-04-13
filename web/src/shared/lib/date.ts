import { WeekDay, WeekType } from '../api';

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
