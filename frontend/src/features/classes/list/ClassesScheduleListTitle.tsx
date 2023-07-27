'use client';

import { getWeekType } from '@/shared/lib/date';
import { useClassesScheduleFiltersStore } from '../filters/store';
import { HUMAN_MONTHS } from '@/shared/constants';

export function ClassesScheduleListTitle() {
  const date = useClassesScheduleFiltersStore(state => state.date);

  const weekType = getWeekType(date);

  return (
    <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
      Расписание занятий на {date.getDate()} {HUMAN_MONTHS[date.getMonth()]} (
      {weekType === 'ЧИСЛ' ? 'Числитель' : 'Знаменатель'})
    </h1>
  );
}
