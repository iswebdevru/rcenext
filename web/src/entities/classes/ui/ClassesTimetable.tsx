import { classNameWithDefaults } from '@/shared/lib/ui';
import { ReactNode } from 'react';

export type Timetable = {
  group: string;
  classes: {
    number: number;
    cabinet: number | string;
    subject: string;
    teacher: string;
    note: string;
  }[];
};

export type ClassesTimetableProps = {
  timetable: Timetable;
  className?: string;
  controlPanel?: ReactNode;
};

export function ClassesTimetable({
  timetable,
  className,
  controlPanel,
}: ClassesTimetableProps) {
  return (
    <table
      className={classNameWithDefaults('w-full bg-white border', className)}
    >
      <tbody>
        <tr className="border">
          <th className="px-3 py-2 text-left border" colSpan={3}>
            <div className="flex items-center justify-between text-sm">
              <div>{timetable.group}</div>
              <div>{controlPanel}</div>
            </div>
          </th>
        </tr>
        {timetable.classes.map(lesson => (
          <tr key={lesson.number} className="border">
            <td className="p-1 text-center border w-[10%] text-sm">
              {lesson.number}
            </td>
            <td className="px-2 py-1 border w">
              <div className="flex flex-wrap justify-between">
                <span className="break-all">{lesson.subject}</span>
                <span className="grid px-1 text-sm leading-none rounded-md place-items-center bg-slate-200">
                  {lesson.note}
                </span>
              </div>
            </td>
            <td className="w-1/6 px-2 py-1 text-sm text-center break-all border">
              {lesson.cabinet}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
