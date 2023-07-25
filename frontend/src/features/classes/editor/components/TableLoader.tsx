import { LoaderRect } from '@/shared/ui/Loader';
import { classPeriods } from '../lib';

export function TableLoader() {
  return (
    <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="w-7 border-r border-zinc-200 px-1.5 py-1 text-sm font-semibold text-zinc-900 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="border-r border-zinc-200 px-1.5 py-1 text-left text-sm font-semibold text-zinc-900 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="w-1/6 px-1.5 py-1 text-left text-sm font-semibold text-zinc-900">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
          </tr>
          {classPeriods.map(period => (
            <tr
              key={period}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <td className="border-r border-zinc-200 px-1.5 py-1 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
              <td className="border-r border-zinc-200 px-1.5 py-1 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
              <td className="px-1.5 py-1 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
