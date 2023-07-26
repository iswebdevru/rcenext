import { formatDate, getAppDate } from '@/shared/lib/date';
import { ClassesScheduleScreen } from '@/features/classes';
import {
  API_CLASSES,
  ClassesScheduleMixed,
  Paginated,
  fetcher,
} from '@/shared/api';

export default async function Page() {
  const date = getAppDate();

  const classesData = await fetcher<Paginated<ClassesScheduleMixed>>(
    `${API_CLASSES}?date=${formatDate(new Date(date))}`,
  );

  return (
    <ClassesScheduleScreen
      classesScheduleFallback={classesData}
      initDate={date}
    />
  );
}

export const metadata = {
  title: 'Пары',
};
