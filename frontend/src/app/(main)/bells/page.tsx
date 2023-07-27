import { API_BELLS, BellsMixed, fetcher } from '@/shared/api';
import { BellsScheduleFilters } from '@/features/bells';
import {
  BellsScheduleTable,
  getBellsScheduleSearchParams,
} from '@/entities/bells';
import { NextServerURLSearchParams } from '@/shared/packages/next';

async function getBellsSchedule(query: string) {
  try {
    return await fetcher<BellsMixed>(`${API_BELLS}?${query}`);
  } catch (error) {
    return null;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: NextServerURLSearchParams;
}) {
  const data = await getBellsSchedule(
    getBellsScheduleSearchParams(searchParams),
  );

  return (
    <div className="container flex gap-4 pt-6">
      <div className="flex-auto">
        {data ? <BellsScheduleTable data={data} /> : 'Not found'}
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
