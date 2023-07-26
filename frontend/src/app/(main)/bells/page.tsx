import { BellsScheduleScreen } from '@/features/bells';
import { getAppDate } from '@/shared/lib/date';

export default function Bells() {
  const date = getAppDate();

  return <BellsScheduleScreen initDate={date} />;
}

export const metadata = {
  title: 'Звонки',
};
