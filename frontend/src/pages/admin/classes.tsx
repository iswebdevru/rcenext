import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Calendar, InputDate } from '@/shared/ui/calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { AdminLayout } from '@/layouts';

export default function Edit() {
  const [scheduleKind, setScheduleKind] = useState<'main' | 'changes'>('main');
  const [date, setDate] = useState(new Date());
  const [weekTypeId, setWeekTypeId] = useState('ЧИСЛ');
  const [selectedWeekDayId, setSelectedWeekDayId] = useState('ПН');

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="p-4 bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-start gap-4">
            <Toggles value={scheduleKind} setValue={setScheduleKind}>
              <Toggles.Variant value="main">Основное</Toggles.Variant>
              <Toggles.Variant value="changes">Изменения</Toggles.Variant>
            </Toggles>
            {scheduleKind === 'main' ? (
              <div className="flex gap-2">
                <div>
                  <SelectWeekDay
                    weekDayId={selectedWeekDayId}
                    onSelect={setSelectedWeekDayId}
                  />
                </div>
                <div>
                  <SelectWeekType
                    weekTypeId={weekTypeId}
                    onSelect={setWeekTypeId}
                  />
                </div>
              </div>
            ) : (
              <InputDate date={date} setDate={setDate} />
            )}

            <Button className="ml-auto">Удалить</Button>
            <Button variant="primary">Добавить</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
