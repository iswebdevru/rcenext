'use client';

// todo: refactor to enable SSR

import { useState } from 'react';
import { Button } from '@/shared/ui/Controls';
import { DateField } from '@/shared/ui/Calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/Select';
import { Toggles } from '@/shared/ui/Controls';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { API_GROUPS, Group, WeekDay, WeekType, apiClasses } from '@/shared/api';
import {
  ClassesScheduleType,
  hasInitAndDraftDiff,
  useClassesStore,
  validateClassesDataDraft,
} from '@/entities/classes';
import { ClassesEditor } from '@/features/classes';
import { formatDate, getAppDate } from '@/shared/lib/date';
import { LoaderCircle } from '@/shared/ui/Loader';

export default function Classes() {
  const [classesStore, dispatch] = useClassesStore();

  // State
  const [classesType, setClassesType] =
    useState<Exclude<ClassesScheduleType, 'mixed'>>('changes');
  const [weekType, setWeekType] = useState<WeekType>('ЧИСЛ');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date(getAppDate()));
  const [isSaving, setIsSaving] = useState(false);

  // Debounced
  const debouncedClassesType = useDebounce(classesType);
  const debouncedWeekType = useDebounce(weekType);
  const debouncedWeekDay = useDebounce(weekDay);
  const debouncedDate = useDebounce(date);

  // Derived
  const debouncedStrDate = formatDate(debouncedDate);

  const {
    data: groups,
    isValidating: areGroupsValidating,
    lastElementRef,
  } = usePaginatedFetch<Group>(API_GROUPS);

  const validatedClassesDataList =
    groups
      ?.flatMap(data => data.results)
      .map(group => [group, classesStore.get(group.url)] as const)
      .filter(
        ([_, classesData]) =>
          classesData &&
          hasInitAndDraftDiff(classesData) &&
          validateClassesDataDraft(classesData.draft),
      )
      .map(([group, data]) => ({ group, draft: data!.draft })) ?? [];

  const canSave = validatedClassesDataList.length > 0;

  async function handleSave() {
    if (!canSave) {
      return;
    }
    setIsSaving(true);
    const updated = await Promise.all(
      validatedClassesDataList.map(({ group, draft }) => {
        return apiClasses.create({
          type: debouncedClassesType,
          view: draft.view,
          date: debouncedStrDate,
          week_day: debouncedWeekDay,
          week_type: debouncedWeekType,
          group: group.url,
          message: draft.view === 'message' ? draft.message : undefined,
          periods: draft.view === 'table' ? draft.periods : undefined,
        } as any);
      }),
    );
    dispatch({
      type: 'remove',
      payload: {
        groups: validatedClassesDataList.map(({ group }) => group.url),
      },
    });
    updated.forEach(data => {
      if (!data) {
        return;
      }
      dispatch({
        type: 'init-defined',
        payload: {
          group: data.group,
          data: data,
        },
      });
    });
    setIsSaving(false);
  }

  return (
    <div className="p-4">
      <div className="mb-5 rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start gap-4">
          <Toggles value={classesType} onToggle={setClassesType}>
            <Toggles.Variant value="main">Основное</Toggles.Variant>
            <Toggles.Variant value="changes">Изменения</Toggles.Variant>
          </Toggles>
          {debouncedClassesType === 'main' ? (
            <div className="flex gap-2">
              <div>
                <SelectWeekDay weekDayId={weekDay} onSelect={setWeekDay} />
              </div>
              <div>
                <SelectWeekType weekTypeId={weekType} onSelect={setWeekType} />
              </div>
            </div>
          ) : (
            <DateField disabled={isSaving} date={date} onDateChange={setDate} />
          )}
          <div className="ml-auto">
            <Button disabled={isSaving} variant="danger-outline">
              Удалить
            </Button>
          </div>
          <div>
            <Button
              variant="primary"
              disabled={!canSave || isSaving}
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {groups
          ?.flatMap(page => page.results)
          .map((group, i, a) => (
            <ClassesEditor
              key={group.id}
              dispatch={dispatch}
              group={group}
              classes={classesStore.get(group.url)}
              searchParams={
                debouncedClassesType === 'main'
                  ? `?type=${debouncedClassesType}&week_day=${debouncedWeekDay}&week_type=${debouncedWeekType}`
                  : `?type=${debouncedClassesType}&date=${debouncedStrDate}`
              }
              ref={a.length - 1 === i ? lastElementRef : null}
            />
          ))}
      </div>
      {areGroupsValidating ? (
        <div className="mt-4 flex justify-center">
          <LoaderCircle />
        </div>
      ) : null}
    </div>
  );
}
