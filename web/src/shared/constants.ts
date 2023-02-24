export const TIMETABLE_TYPES = [
  {
    id: 0,
    value: 'Основное',
  },
  {
    id: 1,
    value: 'Изменения',
  },
] as const;

export const WEEK_TYPES = [
  {
    id: 0,
    value: 'Числитель',
  },
  {
    id: 1,
    value: 'Знаменатель',
  },
] as const;

export const DAYS_OF_THE_WEEK = [
  { id: '1', value: 'Понедельник' },
  { id: '2', value: 'Вторник' },
  { id: '3', value: 'Среда' },
  { id: '4', value: 'Четверг' },
  { id: '5', value: 'Пятница' },
  { id: '6', value: 'Суббота' },
] as const;
