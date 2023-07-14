import { WeekDay, WeekType } from '../api';
import { APP_TIMEZONE } from '../config';

const baseTimestamp = new Date(2000, 0, 3);
export const DAY = 86400000;

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

export type SimplifiedDate = {
  day: number;
  date: number;
  month: number;
};

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

export function getDaysAroundCurrentMonth(date: Date) {
  const nextMonth = (date.getMonth() + 1) % 12;
  const currentDate = new Date(date);
  currentDate.setDate(1);
  while (currentDate.getDay() !== 1) {
    currentDate.setTime(currentDate.getTime() - DAY);
  }
  const result: SimplifiedDate[] = [];
  while (currentDate.getMonth() !== nextMonth || currentDate.getDay() !== 1) {
    result.push({
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      day: currentDate.getDay(),
    });
    currentDate.setTime(currentDate.getTime() + DAY);
  }
  return result;
}

export function getYearsAroundDate(year: number, offset = 10) {
  const result = [];
  let startDate = year - offset - 1;
  for (let i = 0; i < offset * 2; i++) {
    result.push(++startDate);
  }
  return result;
}

export function getAppDate() {
  return new Date().toLocaleDateString('en', {
    timeZone: APP_TIMEZONE,
  });
}
