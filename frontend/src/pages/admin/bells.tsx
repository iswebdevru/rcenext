import { BellsPeriodEditing, useBellsStore } from '@/entities/bells';
import { BellsForm } from '@/features/bells';
import { AdminLayout } from '@/layouts';
import {
  API_BELLS,
  BellsMixed,
  WeekDay,
  createEntity,
  fetcher,
} from '@/shared/api';
import { formatDate, getAppDate } from '@/shared/lib/date';
import { Toggles } from '@/shared/ui/Controls';
import { BellsType, SelectWeekDay } from '@/shared/ui/Select';
import { DateField } from '@/shared/ui/calendar';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import useSWR from 'swr';

type BellsProps = {
  date: string;
};

export default function Bells({ date: initDate }: BellsProps) {
  const [bellsVariant, setBellsVariant] = useState<BellsType>('normal');
  const [bellsType, setBellsType] = useState<'main' | 'changes'>('main');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date(initDate));

  const [bellsPeriods, dispatch] = useBellsStore();

  useSWR<BellsMixed>(
    `${API_BELLS}?type=${bellsType}&date=${formatDate(
      date,
    )}&week_day=${weekDay}&variant=${bellsVariant}`,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: data => {
        dispatch({
          type: 'load',
          payload: data.periods,
        });
      },
      onError: () => {
        dispatch({ type: 'init' });
      },
    },
  );

  const handleSave = async (periods: BellsPeriodEditing[]) => {
    const data = await createEntity<BellsMixed, unknown>(API_BELLS, {
      body: {
        type: bellsType,
        variant: bellsVariant,
        date: formatDate(date),
        week_day: weekDay,
        periods: periods,
      },
    });
    if (data) {
      dispatch({
        type: 'load',
        payload: data.periods,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="flex gap-4">
          <div className="">
            <div className="space-y-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div>
                <Toggles value={bellsType} onToggle={setBellsType}>
                  <Toggles.Variant value="main">Основной</Toggles.Variant>
                  <Toggles.Variant value="changes">Изменения</Toggles.Variant>
                </Toggles>
              </div>
              <div>
                <Toggles value={bellsVariant} onToggle={setBellsVariant}>
                  <Toggles.Variant value="normal">Обычный</Toggles.Variant>
                  <Toggles.Variant value="reduced">Сокращенный</Toggles.Variant>
                </Toggles>
              </div>
              <div>
                {bellsType === 'main' ? (
                  <SelectWeekDay weekDayId={weekDay} onSelect={setWeekDay} />
                ) : (
                  <DateField date={date} onDateChange={setDate} />
                )}
              </div>
            </div>
          </div>
          <div className="flex-auto">
            <BellsForm
              periods={bellsPeriods}
              dispatch={dispatch}
              onSave={handleSave}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps<BellsProps> = async () => {
  return {
    props: {
      date: getAppDate(),
    },
  };
};
