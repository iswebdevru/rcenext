import { WeekType } from '../api';
import { APP_TIMEZONE } from '../config';

const baseTimestamp = new Date(2000, 0, 3);
export const DAY = 86400000;

export const appDateFormatter = new Intl.DateTimeFormat('en', {
  timeZone: APP_TIMEZONE,
});

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function getWeekTypeFromDate(date: Date): WeekType {
  return ((date.getTime() - baseTimestamp.getTime()) / DAY) % 14 < 7
    ? 'ЗНАМ'
    : 'ЧИСЛ';
}

export type SimplifiedDate = {
  day: number;
  date: number;
  month: number;
};

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
  return appDateFormatter.format(new Date());
}
