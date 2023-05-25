import { ReactNode, forwardRef } from 'react';
import useSWR from 'swr';
import {
  ClassesScheduleMixed,
  ClassesSchedulePeriod,
  Group,
  Subject,
  fetcher,
} from '@/shared/api';
import { withBlankPeriods } from '../lib';
import { ClassesPartialPeriod } from '../types';
import { LoaderRect } from '@/shared/ui/Loader';

export type ClassesCardProps = {
  schedule: ClassesScheduleMixed;
  controlPanel?: ReactNode;
};

export const ClassesScheduleCard = forwardRef<HTMLDivElement, ClassesCardProps>(
  function ClassesScheduleCard({ schedule, controlPanel }, ref) {
    const { data: group } = useSWR<Group>(schedule.group, fetcher);

    return (
      <div
        ref={ref}
        className="bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
      >
        <div className="py-1.5 px-2.5 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {group?.name ?? (
              <div className="w-16 h-5 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            )}
          </h3>
        </div>
        {schedule.view === 'table' ? (
          <ClassesCardTableView periods={schedule.periods} />
        ) : (
          <ClassesCardMessageView message={schedule.message} />
        )}
      </div>
    );
  }
);

type ClassesCardTableViewProps = {
  periods: ClassesSchedulePeriod[];
};
function ClassesCardTableView({ periods }: ClassesCardTableViewProps) {
  return (
    <div>
      <table className="w-full">
        <tbody>
          {withBlankPeriods(periods).map(period => (
            <ClassesCardPeriod key={period.index} period={period} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ClassesCardPeriodProps = {
  period: ClassesPartialPeriod;
};

function ClassesCardPeriod({ period }: ClassesCardPeriodProps) {
  const { data: subject } = useSWR<Subject>(period.subject, fetcher);

  return (
    <tr
      key={period.index}
      className="text-sm border-b border-zinc-200 dark:border-zinc-700 last:border-0 text-zinc-700 dark:text-zinc-300"
    >
      <td className="w-0 px-2.5 py-1 text-sm text-center border-r border-zinc-200 dark:border-zinc-700">
        {period.index}
      </td>
      <td className="px-2 py-1 text-sm border-r border-zinc-200 dark:border-zinc-700 ">
        {period.subject
          ? subject?.name ?? (
              <div className="w-full h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            )
          : ''}
      </td>
      <td className="w-10 px-2.5 py-1 text-sm text-center">{period.cabinet}</td>
    </tr>
  );
}

type ClassesCardMessageViewProps = {
  message: string;
};
function ClassesCardMessageView({ message }: ClassesCardMessageViewProps) {
  return <div>{message}</div>;
}
