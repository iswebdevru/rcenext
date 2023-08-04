'use client';

import { ReactNode } from 'react';
import useSWR from 'swr';
import {
  ClassesScheduleMixed,
  ClassesSchedulePeriod,
  Group,
  Subject,
} from '@/shared/api';
import { LoaderRect } from '@/shared/ui/Loader';
import { withBlankPeriods } from '../lib';
import { ClassesPartialPeriod } from '../types';

export type ClassesCardProps = {
  schedule: ClassesScheduleMixed;
  controlPanel?: ReactNode;
};

export function ClassesScheduleCard({ schedule }: ClassesCardProps) {
  const { data: group } = useSWR<Group>(schedule.group);

  return (
    <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900  ">
      <div className="border-b border-zinc-200 px-2.5 py-1.5 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          {group?.name ?? (
            <div className="h-5 w-16 overflow-hidden rounded-md">
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
  const { data: subject } = useSWR<Subject>(period.subject);

  return (
    <tr
      key={period.index}
      className="border-b border-zinc-200 text-sm text-zinc-700 last:border-0 dark:border-zinc-800 dark:text-zinc-300"
    >
      <td className="w-0 border-r border-zinc-200 px-2.5 py-1 text-center text-sm dark:border-zinc-800">
        {period.index}
      </td>
      <td className="border-r border-zinc-200 px-2 py-1 text-sm dark:border-zinc-800 ">
        {period.subject
          ? subject?.name ?? (
              <div className="h-4 w-full overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            )
          : ''}
      </td>
      <td className="w-10 px-2.5 py-1 text-center text-sm">{period.cabinet}</td>
    </tr>
  );
}

type ClassesCardMessageViewProps = {
  message: string;
};
function ClassesCardMessageView({ message }: ClassesCardMessageViewProps) {
  return <div>{message}</div>;
}
