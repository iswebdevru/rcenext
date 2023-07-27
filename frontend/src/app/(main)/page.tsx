import {
  ClassesScheduleType,
  getClassesScheduleSearchParams,
} from '@/entities/classes';
import {
  ClassesScheduleFilters,
  ClassesScheduleListTitle,
} from '@/features/classes';
import { ClassesScheduleList } from '@/features/classes';
import {
  API_CLASSES,
  ClassesScheduleMixed,
  Paginated,
  WeekDay,
  WeekType,
  fetcher,
} from '@/shared/api';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = getClassesScheduleSearchParams({
    type: searchParams['type']?.toString() as ClassesScheduleType,
    weekDay: searchParams['week_day']?.toString() as WeekDay,
    weekType: searchParams['week_type']?.toString() as WeekType,
    date: searchParams['date']?.toString(),
    block: searchParams['block']?.toString(),
    groupName: searchParams['groupName']?.toString(),
    cabinet: searchParams['cabinet']?.toString(),
  });
  const classesData = await fetcher<Paginated<ClassesScheduleMixed>>(
    `${API_CLASSES}?${query}`,
  );
  console.log(classesData);

  return (
    <div className="container gap-6 pt-6 lg:flex">
      <div className="grow">
        <ClassesScheduleListTitle />
        <ClassesScheduleList prefetched={classesData} />
      </div>
      <div className="flex-shrink-0">
        <ClassesScheduleFilters />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Пары',
};
