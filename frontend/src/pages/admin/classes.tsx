import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { InputDate } from '@/shared/ui/calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { AdminLayout } from '@/layouts';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_GROUPS, Group, WeekDay, WeekType } from '@/shared/api';
import { ClassesForm } from '@/features/classes/ClassesForm';
import { ClassesType } from '@/entities/classes';

export default function Classes() {
  const [classesType, setClassesType] = useState<ClassesType>('changes');
  const [weekTypeId, setWeekTypeId] = useState<WeekType>('ЧИСЛ');
  const [selectedWeekDayId, setSelectedWeekDayId] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date());

  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="p-4 mb-4 bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-start gap-4">
            <Toggles value={classesType} setValue={setClassesType}>
              <Toggles.Variant value="main">Основное</Toggles.Variant>
              <Toggles.Variant value="changes">Изменения</Toggles.Variant>
            </Toggles>
            {classesType === 'main' ? (
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
            <Button variant="primary">Сохранить</Button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {groups
            ?.flatMap(page => page.results)
            .map((group, i, a) => (
              <ClassesForm
                key={group.id}
                groupURL={group.url}
                ref={a.length - 1 === i ? lastElementRef : null}
                classesType={classesType}
              />
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
