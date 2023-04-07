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
  controlPanel?: ReactNode;
};

export function ClassesTimetable({
  timetable,
  controlPanel,
}: ClassesTimetableProps) {
  return (
    <div className="bg-white border rounded-lg border-slate-200 dark:bg-slate-800 dark:border-slate-700">
      <table className="w-full h-full">
        <tbody>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="px-3 py-2 text-left" colSpan={3}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 font dark:text-slate-200">
                  {timetable.group}
                </span>
                <div>{controlPanel}</div>
              </div>
            </th>
          </tr>
          {timetable.classes.map(lesson => (
            <tr
              key={lesson.number}
              className="text-sm border-b text-slate-900 dark:text-slate-200 border-slate-200 dark:border-slate-700 last:border-0"
            >
              <td className="p-2 text-center">{lesson.number}</td>
              <td className="p-2">
                <div className="flex flex-wrap justify-between">
                  <span className="break-all">{lesson.subject}</span>
                  <span className="grid p-1 text-xs leading-none rounded-md text-slate-700 dark:text-slate-300 place-items-center bg-slate-200 dark:bg-slate-700">
                    {lesson.note}
                  </span>
                </div>
              </td>
              <td className="p-2 text-center break-all">{lesson.cabinet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
