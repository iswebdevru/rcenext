'use client';

import { API_CLASSES, ClassesScheduleMixed, Paginated } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { LoaderCircle } from '@/shared/ui/Loader';
import {
  ClassesScheduleCard,
  getClassesScheduleSearchParams,
} from '@/entities/classes';
import { useClassesScheduleFiltersStore } from '../filters/store';
import { WEEKDAYS_MAP, getWeekType } from '@/shared/lib/date';
import { useSearchParams } from 'next/navigation';

export type ClassesScheduleListProps = {
  prefetched: Paginated<ClassesScheduleMixed>;
};

export function ClassesScheduleList({ prefetched }: ClassesScheduleListProps) {
  const { type, date, block, groupName, cabinet } =
    useClassesScheduleFiltersStore();

  const weekType = getWeekType(date);
  const weekDay = WEEKDAYS_MAP[date.getDay()];

  const searchParams = getClassesScheduleSearchParams({
    type: useDebounce(type),
    weekDay: useDebounce(weekDay),
    weekType: useDebounce(weekType),
    date: useDebounce(date),
    block: useDebounce(block),
    groupName: useDebounce(groupName),
    cabinet: useDebounce(cabinet),
  });

  const url = `${API_CLASSES}?${searchParams}`;

  const { data, lastElementRef, isValidating } =
    usePaginatedFetch<ClassesScheduleMixed>(url, {
      fallbackData: [prefetched],
    });

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data
          ?.flatMap(page => page.results)
          .map((schedule, i, a) => (
            <ClassesScheduleCard
              key={schedule.id}
              schedule={schedule}
              ref={a.length - 1 === i ? lastElementRef : null}
            />
          ))}
      </div>
      {isValidating ? (
        <div className="mt-4 flex justify-center">
          <LoaderCircle />
        </div>
      ) : null}
    </>
  );
}
