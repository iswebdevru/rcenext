import { displayGroupName } from '@/entities/groups';
import {
  ClassesScheduleMixed,
  ClassesSchedulePeriod,
  Group,
  Subject,
  fetcher,
} from '@/shared/api';
import { ReactNode, forwardRef } from 'react';
import useSWR from 'swr';

export type ClassesScheduleCardProps = {
  schedule: ClassesScheduleMixed;
  controlPanel?: ReactNode;
};

type ClassesScheduleCardPeriod = {
  period: ClassesSchedulePeriod;
};

function ClassesScheduleCardPeriod({ period }: ClassesScheduleCardPeriod) {
  const { data: subject } = useSWR<Subject>(period.subject, fetcher);

  return (
    <tr
      key={period.index}
      className="text-sm border-b text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-700 last:border-0"
    >
      <td className="p-2 text-center">{period.index}</td>
      <td className="p-2">
        <div className="flex flex-wrap justify-between">
          <span className="break-all">{subject ? subject.name : null}</span>
          {period.note ? (
            <span className="grid p-1 text-xs leading-none rounded-md text-slate-700 dark:text-slate-300 place-items-center bg-slate-200 dark:bg-slate-700">
              {period.note}
            </span>
          ) : null}
        </div>
      </td>
      <td className="p-2 text-center break-all">{period.cabinet}</td>
    </tr>
  );
}

export const ClassesScheduleCard = forwardRef<
  HTMLDivElement,
  ClassesScheduleCardProps
>(function ClassesScheduleCard({ schedule, controlPanel }, ref) {
  const { data: group } = useSWR<Group>(schedule.group, fetcher);

  return (
    <div
      ref={ref}
      className="bg-white border rounded-lg border-slate-200 dark:bg-slate-800 dark:border-slate-700"
    >
      <table className="w-full h-full">
        <tbody>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="px-3 py-2 text-left" colSpan={3}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 font dark:text-slate-200">
                  {group ? displayGroupName(group) : null}
                </span>
                <div>{controlPanel}</div>
              </div>
            </th>
          </tr>
          {schedule.periods.map(period => (
            <ClassesScheduleCardPeriod key={period.index} period={period} />
          ))}
        </tbody>
      </table>
    </div>
  );
});
