import { Group } from '@/shared/api';
import { ClassesPartialPeriod, ClassesStoreAction } from '@/entities/classes';
import { SubjectSelect } from '@/entities/subjects';

export type ClassesTableViewProps = {
  periods: ClassesPartialPeriod[];
  group: Group;
  dispatch: (value: ClassesStoreAction) => void;
};

export function ClassesTableView({
  periods,
  dispatch,
  group,
}: ClassesTableViewProps) {
  return (
    <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 text-zinc-900 dark:border-zinc-800 dark:text-zinc-200">
            <th className="w-7 border-r border-zinc-200 px-1 py-0.5 text-sm font-semibold dark:border-zinc-800">
              №
            </th>
            <th className="border-r border-zinc-200 px-1 py-0.5 text-left text-sm font-semibold dark:border-zinc-800">
              Предмет
            </th>
            <th className="w-1/6 px-1 py-0.5 text-left text-sm font-semibold">
              Каб.
            </th>
          </tr>
          {periods.map(period => (
            <tr
              key={period.index}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-800"
            >
              <td className="border-r border-zinc-200 px-1 py-0.5 text-center text-sm text-zinc-500 dark:border-zinc-800">
                {period.index}
              </td>
              <td className="border-r border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                <SubjectSelect
                  selectedSubjectURL={period.subject}
                  onSelect={subject =>
                    dispatch({
                      type: 'change-period',
                      payload: {
                        group: group.url,
                        data: { index: period.index, subject },
                      },
                    })
                  }
                />
              </td>
              <td className="text-sm">
                <input
                  type="text"
                  name="cabinet"
                  className="w-full bg-transparent px-1 py-0.5 text-sm text-zinc-700 dark:text-zinc-300"
                  value={period.cabinet}
                  onChange={e => {
                    dispatch({
                      type: 'change-period',
                      payload: {
                        group: group.url,
                        data: {
                          index: period.index,
                          cabinet: e.currentTarget.value,
                        },
                      },
                    });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
