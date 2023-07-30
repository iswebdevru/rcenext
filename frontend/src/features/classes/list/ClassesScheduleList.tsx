'use client';

import useSWRInfinite from 'swr/infinite';
import { ClassesScheduleMixed, Paginated } from '@/shared/api';
import { ClassesScheduleCard } from '@/entities/classes';
import { InfiniteScroll } from '@/shared/ui/InfiniteScroll';
import { createInfiniteKey } from '@/shared/packages/swr';
import { LoaderCircle } from '@/shared/ui/Loader';

export type ClassesScheduleListProps = {
  firstPage: Paginated<ClassesScheduleMixed>;
};

export function ClassesScheduleList({ firstPage }: ClassesScheduleListProps) {
  const { data, isValidating, setSize } = useSWRInfinite<
    Paginated<ClassesScheduleMixed>
  >(createInfiniteKey(firstPage.next));

  const pages = data ? [firstPage, ...data] : [firstPage];

  return (
    <InfiniteScroll loadMore={() => setSize(p => p + 1)}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {pages
          .flatMap(page => page.results)
          .map(schedule => (
            <ClassesScheduleCard key={schedule.id} schedule={schedule} />
          ))}
      </div>
      {isValidating ? (
        <div className="mt-4 flex justify-center">
          <LoaderCircle />
        </div>
      ) : null}
    </InfiniteScroll>
  );
}
