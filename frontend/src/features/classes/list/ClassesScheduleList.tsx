'use client';

import { ClassesScheduleMixed, Paginated } from '@/shared/api';
import { ClassesScheduleCard } from '@/entities/classes';
import { InfiniteScroll } from '@/shared/ui/InfiniteScroll';

export type ClassesScheduleListProps = {
  firstPage: Paginated<ClassesScheduleMixed>;
};

export function ClassesScheduleList({ firstPage }: ClassesScheduleListProps) {
  // const { data, lastElementRef, isValidating } =
  //   usePaginatedFetch<ClassesScheduleMixed>(url, {
  //     fallbackData: [firstPage],
  //   });

  return (
    <>
      <InfiniteScroll loadMore={() => {}}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {firstPage.results.map((schedule, i, a) => (
            <ClassesScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </InfiniteScroll>
      {/* {isValidating ? (
        <div className="mt-4 flex justify-center">
          <LoaderCircle />
        </div>
      ) : null} */}
    </>
  );
}
