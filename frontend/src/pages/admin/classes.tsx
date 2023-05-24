import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { InputDate } from '@/shared/ui/calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { AdminLayout } from '@/layouts';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_GROUPS, Group, WeekDay, WeekType } from '@/shared/api';
import {
  ClassesType,
  getMainStoreKey,
  useClassesStore,
} from '@/entities/classes';
import { ClassesForm } from '@/features/classes';
import { formatDate } from '@/shared/lib/date';

export default function Classes() {
  const [classesType, setClassesType] = useState<ClassesType>('changes');
  const [weekType, setWeekType] = useState<WeekType>('ЧИСЛ');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date());

  const [classesStore, dispatch] = useClassesStore();

  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);

  const strDate = formatDate(date);

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
                  <SelectWeekDay weekDayId={weekDay} onSelect={setWeekDay} />
                </div>
                <div>
                  <SelectWeekType
                    weekTypeId={weekType}
                    onSelect={setWeekType}
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
            .map((group, i, a) =>
              classesType === 'main' ? (
                <ClassesForm
                  key={group.id}
                  type="main"
                  dispatch={action => {
                    dispatch({
                      classesType: 'main',
                      weekDay,
                      weekType,
                      groupId: group.id,
                      ...action,
                    });
                  }}
                  group={group}
                  classes={classesStore.main
                    .get(getMainStoreKey(weekType, weekDay))
                    ?.get(group.id)}
                  searchParams={`?week_day=${weekDay}&week_type=${weekType}`}
                  ref={a.length - 1 === i ? lastElementRef : null}
                />
              ) : (
                <ClassesForm
                  key={group.id}
                  type="changes"
                  dispatch={action => {
                    dispatch({
                      classesType: 'changes',
                      date: strDate,
                      groupId: group.id,
                      ...action,
                    });
                  }}
                  group={group}
                  classes={classesStore.changes.get(strDate)?.get(group.id)}
                  searchParams={`?date=${strDate}`}
                  ref={a.length - 1 === i ? lastElementRef : null}
                />
              )
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
