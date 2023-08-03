import { NextPageWithSearchParams } from '@/shared/packages/next';
import { API_BELLS, BellsMixed, fetcher } from '@/shared/api';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableMain,
  TableRow,
} from '@/shared/ui/Table';
import { getBellsScheduleSearchParams } from '@/entities/bells';
import { BellsScheduleFilters } from '@/features/bells';

async function getBellsSchedule(query: URLSearchParams) {
  try {
    return await fetcher<BellsMixed>(`${API_BELLS}?${query}`);
  } catch (error) {
    return null;
  }
}

export default async function Page({ searchParams }: NextPageWithSearchParams) {
  const data = await getBellsSchedule(
    getBellsScheduleSearchParams(searchParams),
  );

  return (
    <div className="container flex gap-4 pt-6">
      <div className="flex-auto">
        {data ? (
          <Table>
            <TableMain>
              <TableHead>
                <TableRow>
                  <TableHeadCell>№</TableHeadCell>
                  <TableHeadCell>Время</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.periods.map(period => (
                  <TableRow key={period.index}>
                    <TableDataCell>{period.index}</TableDataCell>
                    <TableDataCell>
                      <div className="space-y-2">
                        <div>
                          {period.period_from}
                          {' - '}
                          {period.period_to}
                        </div>
                        {period.has_break ? (
                          <div>
                            {period.period_from_after}
                            {' - '}
                            {period.period_to_after}
                          </div>
                        ) : null}
                      </div>
                    </TableDataCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableMain>
          </Table>
        ) : (
          'Not found'
        )}
      </div>
      <div className="flex-none">
        <BellsScheduleFilters />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Звонки',
};
