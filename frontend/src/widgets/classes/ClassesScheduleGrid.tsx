import {
  ClassesScheduleCard,
  ClassesScheduleQuery,
  useClassesSchedule,
} from '@/entities/classes';

export function ClassesScheduleGrid(props: ClassesScheduleQuery) {
  const { data, lastElementRef } = useClassesSchedule(props);

  return (
    <div className="grid justify-between grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {data
        ?.map(page => page.results)
        .flat()
        .map((schedule, i, a) => (
          <ClassesScheduleCard
            key={schedule.url}
            schedule={schedule}
            ref={i === a.length - 1 ? lastElementRef : null}
          />
        ))}
    </div>
  );
}
