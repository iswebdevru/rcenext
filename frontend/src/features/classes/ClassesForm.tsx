import { forwardRef, useState } from 'react';
import useSWR from 'swr';
import { Group, Hyperlink, fetcher } from '@/shared/api';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubjectSelect } from '../subjects';
import { ClassesType } from '@/entities/classes';

export const classPeriods = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type ClassesFormProps = {
  groupURL: Hyperlink;
  classesType: ClassesType;
};

const defaultPeriods = {
  0: { subjectURL: null, cabinet: null },
  1: { subjectURL: null, cabinet: null },
  2: { subjectURL: null, cabinet: null },
  3: { subjectURL: null, cabinet: null },
  4: { subjectURL: null, cabinet: null },
  5: { subjectURL: null, cabinet: null },
  6: { subjectURL: null, cabinet: null },
  7: { subjectURL: null, cabinet: null },
} as const;

export const ClassesForm = forwardRef<HTMLDivElement, ClassesFormProps>(
  function ClassesFormComponent({ groupURL }, ref) {
    const [periods, setPeriods] = useState(defaultPeriods);
    const { data: group } = useSWR<Group>(groupURL, fetcher);

    return (
      <div
        className="bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        ref={ref}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-bold">{group?.name}</div>
          <div>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100">
              <FontAwesomeIcon icon={faEllipsis} fixedWidth size="lg" />
            </button>
          </div>
        </div>
        <table className="w-full">
          <tbody>
            <tr className="border-t border-b border-zinc-200 dark:border-zinc-700">
              <th className="text-zinc-900 font-semibold border-r border-zinc-200 px-1 py-0.5 text-sm w-7 dark:border-zinc-700">
                №
              </th>
              <th className="text-zinc-900 font-semibold text-left border-r border-zinc-200 px-1 text-sm py-0.5 dark:border-zinc-700">
                Предмет
              </th>
              <th className="text-zinc-900 font-semibold text-left px-1 text-sm py-0.5 w-1/6">
                Каб.
              </th>
            </tr>
            {classPeriods.map(period => (
              <tr
                key={period}
                className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
              >
                <td className="border-r border-zinc-200 text-center text-sm px-1 py-0.5 dark:border-zinc-700">
                  {period}
                </td>
                <td className="border-r border-zinc-200 dark:border-zinc-700">
                  <SubjectSelect
                    selectedSubjectURL={periods[period].subjectURL}
                    onSelect={selectedSubjectURL => {
                      setPeriods(p => ({
                        ...p,
                        [period]: {
                          ...p[period],
                          subjectURL: selectedSubjectURL,
                        },
                      }));
                    }}
                  />
                </td>
                <td className="text-sm">
                  <input type="text" className="w-full px-1 py-0.5 text-sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
