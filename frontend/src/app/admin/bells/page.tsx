'use client';

import { BellsForm } from '@/features/bells';
import { WeekDay } from '@/shared/api';
import { useDebounce } from '@/shared/hooks';
import { Toggles } from '@/shared/ui/Controls';
import { BellsType, SelectWeekDay } from '@/shared/ui/Select';
import { DateField } from '@/shared/ui/Calendar';
import { useState } from 'react';

export default function Bells() {
  const [bellsVariant, setBellsVariant] = useState<BellsType>('normal');
  const [bellsType, setBellsType] = useState<'main' | 'changes'>('main');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date(''));

  return (
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
            date={useDebounce(date)}
            type={useDebounce(bellsType)}
            variant={useDebounce(bellsVariant)}
            weekDay={useDebounce(weekDay)}
          />
        </div>
      </div>
    </div>
  );
}
