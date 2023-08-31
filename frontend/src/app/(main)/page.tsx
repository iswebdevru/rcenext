import { NextPageWithSearchParams } from '@/shared/packages/next';
import {
  API_CLASSES,
  ClassesScheduleMixed,
  Paginated,
  fetcher,
} from '@/shared/api';
import { getClassesScheduleSearchParams } from '@/entities/classes';
import {
  ClassesScheduleFilters,
  ClassesScheduleList,
} from '@/features/classes';
import { getWeekTypeFromDate } from '@/shared/lib/date';
import { getHumanMonth, getHumanWeekType } from '@/shared/lib/human';

export default async function Page({ searchParams }: NextPageWithSearchParams) {
  const query = getClassesScheduleSearchParams(searchParams);

  const firstPage = await fetcher<Paginated<ClassesScheduleMixed>>(
    `${API_CLASSES}?${query}`,
  );

  const date = new Date(query.get('date')!);
  const weekType = getWeekTypeFromDate(date);

  return (
    <div className="container gap-6 pt-6 lg:flex">
      <div className="flex-auto">
        <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
          Расписание занятий на {date.getDate()} {getHumanMonth(date)} (
          {getHumanWeekType(weekType)})
        </h1>
        <ClassesScheduleList firstPage={firstPage} />
      </div>
      <div className="flex-none">
        <ClassesScheduleFilters />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Пары',
};

export const dynamic = 'force-dynamic';