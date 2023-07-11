import { WeekDay, WeekType } from './api';

export const WEEK_TYPES = new Map<WeekType, string>([
  ['ЧИСЛ', 'Числитель'],
  ['ЗНАМ', 'Знаменатель'],
]);

export const HUMAN_WEEKDAYS = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
];

export const HUMAN_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export const WEEK_DAYS = new Map<WeekDay, string>([
  ['ПН', 'Понедельник'],
  ['ВТ', 'Вторник'],
  ['СР', 'Среда'],
  ['ЧТ', 'Четверг'],
  ['ПТ', 'Пятница'],
  ['СБ', 'Суббота'],
]);

export const APP_TIMEZONE = 'Europe/Moscow';
