export type WeekType = 'ЧИСЛ' | 'ЗНАМ';
export type WeekDay = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ';

export const WEEK_TYPES = [
  {
    id: 'ЧИСЛ',
    value: 'Числитель',
  },
  {
    id: 'ЗНАМ',
    value: 'Знаменатель',
  },
] as const;

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

export const WEEK_DAYS = [
  { id: 'ПН', value: 'Понедельник' },
  { id: 'ВТ', value: 'Вторник' },
  { id: 'СР', value: 'Среда' },
  { id: 'ЧТ', value: 'Четверг' },
  { id: 'ПТ', value: 'Пятница' },
  { id: 'СБ', value: 'Суббота' },
] as const;
