'use client';

import { DateField } from '@/shared/ui/Calendar';
import { Toggles } from '@/shared/ui/Controls';
import { SelectWeekDay } from '@/shared/ui/Select';
import { useBellsScheduleEditFiltersStore } from './store';

export function BellsScheduleEditFilters() {
  const {
    type,
    variant,
    date,
    weekDay,
    changeType,
    changeVariant,
    changeDate,
    changeWeekDay,
  } = useBellsScheduleEditFiltersStore();

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <Toggles value={type} onToggle={changeType}>
          <Toggles.Variant value="main">Основной</Toggles.Variant>
          <Toggles.Variant value="changes">Изменения</Toggles.Variant>
        </Toggles>
      </div>
      <div>
        <Toggles value={variant} onToggle={changeVariant}>
          <Toggles.Variant value="normal">Обычный</Toggles.Variant>
          <Toggles.Variant value="reduced">Сокращенный</Toggles.Variant>
        </Toggles>
      </div>
      <div>
        {type === 'main' ? (
          <SelectWeekDay weekDayId={weekDay} onSelect={changeWeekDay} />
        ) : (
          <DateField
            date={date}
            onDateChange={v => {
              if (v instanceof Date) {
                changeDate(v);
              } else {
                changeDate(v(date));
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
