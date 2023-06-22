import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { InputDate } from '@/shared/ui/calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { AdminLayout } from '@/layouts';
import { useDate, usePaginatedFetch } from '@/shared/hooks';
import {
  API_CLASSES,
  API_GROUPS,
  ClassesScheduleMixed,
  Group,
  WeekDay,
  WeekType,
  createEntity,
} from '@/shared/api';
import {
  ClassesType,
  getStoreKey,
  hasInitAndDraftDiff,
  useClassesStore,
  validateClassesDataDraft,
} from '@/entities/classes';
import { ClassesEditor } from '@/features/classes';
import { formatDate } from '@/shared/lib/date';
import Head from 'next/head';

export default function Classes() {
  // State
  const [classesType, setClassesType] =
    useState<Exclude<ClassesType, 'mixed'>>('changes');
  const [weekType, setWeekType] = useState<WeekType>('ЧИСЛ');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useDate();
  const [classesStore, dispatch] = useClassesStore();
  const [isSaving, setIsSaving] = useState(false);
  const strDate = date ? formatDate(date) : '';
  const storeKey = date
    ? getStoreKey({
        classesType,
        weekDay,
        weekType,
        date: strDate,
      })
    : null;
  const classesDayStore = storeKey
    ? classesStore[classesType].get(storeKey)
    : null;
  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);

  const validatedClassesDataList = classesDayStore
    ? [...classesDayStore.entries()]
        .filter(
          ([_, classesData]) =>
            hasInitAndDraftDiff(classesData) &&
            validateClassesDataDraft(classesData.draft)
        )
        .map(([group, data]) => ({ group, draft: data.draft }))
    : [];
  const canSave = validatedClassesDataList.length > 0;

  async function handleSave() {
    if (!canSave) {
      return;
    }
    setIsSaving(true);
    dispatch({
      type: 'remove',
      payload: validatedClassesDataList.map(({ group }) => group),
      classesType,
      weekDay,
      weekType,
      date: strDate,
    });
    const updated = await Promise.all(
      validatedClassesDataList.map(({ group, draft }) => {
        return createEntity<ClassesScheduleMixed, unknown>(API_CLASSES, {
          body: {
            type: classesType,
            view: draft.view,
            date: strDate,
            week_day: weekDay,
            week_type: weekType,
            group,
            message: draft.view === 'message' ? draft.message : undefined,
            periods:
              draft.view === 'table'
                ? draft.periods.filter(period => period.subject !== null)
                : undefined,
          },
        });
      })
    );
    updated.forEach(data => {
      if (!data) {
        return;
      }
      dispatch({
        type: 'init-defined',
        classesType,
        group: data.group,
        weekDay,
        weekType,
        date: strDate,
        payload: data,
      });
    });
    setIsSaving(false);
  }

  return (
    <>
      <Head>
        <title>Занятия</title>
      </Head>
      <AdminLayout>
        <div className="p-4">
          <div className="mb-4 rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-start gap-4">
              <Toggles value={classesType} onToggle={setClassesType}>
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
                <InputDate
                  disabled={isSaving}
                  date={date}
                  onDateChange={setDate}
                />
              )}

              <Button
                className="ml-auto"
                disabled={isSaving}
                variant="danger-outline"
              >
                Удалить
              </Button>
              <Button
                variant="primary"
                disabled={!canSave || isSaving}
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {groups
              ?.flatMap(page => page.results)
              .map((group, i, a) =>
                classesType === 'main' ? (
                  <ClassesEditor
                    key={`${weekType}${weekDay}${group.id}`}
                    type={classesType}
                    dispatch={action => {
                      dispatch({
                        classesType: 'main',
                        weekDay,
                        weekType,
                        group: group.url,
                        ...action,
                      });
                    }}
                    group={group}
                    classes={classesDayStore?.get(group.url)}
                    searchParams={`?type=${classesType}&week_day=${weekDay}&week_type=${weekType}`}
                    ref={a.length - 1 === i ? lastElementRef : null}
                  />
                ) : (
                  <ClassesEditor
                    key={`${strDate}${group.id}`}
                    type={classesType}
                    dispatch={action => {
                      dispatch({
                        classesType: 'changes',
                        date: strDate,
                        group: group.url,
                        ...action,
                      });
                    }}
                    group={group}
                    classes={classesDayStore?.get(group.url)}
                    searchParams={`?date=${strDate}`}
                    ref={a.length - 1 === i ? lastElementRef : null}
                  />
                )
              )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
