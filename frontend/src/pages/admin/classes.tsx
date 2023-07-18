import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Button } from '@/shared/ui/Controls';
import { DateField } from '@/shared/ui/calendar';
import { SelectWeekType, SelectWeekDay } from '@/shared/ui/Select';
import { Toggles } from '@/shared/ui/Controls';
import { AdminLayout } from '@/layouts';
import { useDebounce, usePaginatedFetch, usePrevious } from '@/shared/hooks';
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
  getClassesDataKey,
  hasInitAndDraftDiff,
  useClassesStore,
  validateClassesDataDraft,
} from '@/entities/classes';
import { ClassesEditor } from '@/features/classes';
import { formatDate, getAppDate } from '@/shared/lib/date';

type ClassesProps = {
  date: string;
};

export default function Classes({ date: initDate }: ClassesProps) {
  const [classesStore, dispatch] = useClassesStore();

  // State
  const [classesType, setClassesType] =
    useState<Exclude<ClassesType, 'mixed'>>('changes');
  const [weekType, setWeekType] = useState<WeekType>('ЧИСЛ');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [date, setDate] = useState(new Date(initDate));
  const [isSaving, setIsSaving] = useState(false);

  // Debounced
  const debouncedClassesType = useDebounce(classesType);
  const debouncedWeekType = useDebounce(weekType);
  const debouncedWeekDay = useDebounce(weekDay);
  const debouncedDate = useDebounce(date);

  // Previous states
  const prevDebouncedClassesType = usePrevious(classesType);
  const prevDebouncedWeekType = usePrevious(weekType);
  const prevDebouncedWeekDay = usePrevious(weekDay);
  const prevDebouncedDate = usePrevious(debouncedDate);

  // Derived
  const debouncedStrDate = formatDate(debouncedDate);

  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);

  const validatedClassesDataList =
    groups
      ?.flatMap(data => data.results)
      .map(
        group =>
          [
            group,
            classesStore.get(
              getClassesDataKey({
                group: group.url,
                classesType: debouncedClassesType,
                date: debouncedStrDate,
                weekDay: debouncedWeekDay,
                weekType: debouncedWeekType,
              }),
            ),
          ] as const,
      )
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
        return createEntity<ClassesScheduleMixed, unknown>(API_CLASSES, {
          body: {
            type: debouncedClassesType,
            view: draft.view,
            date: debouncedStrDate,
            week_day: debouncedWeekDay,
            week_type: debouncedWeekType,
            group: group.url,
            message: draft.view === 'message' ? draft.message : undefined,
            periods: draft.view === 'table' ? draft.periods : undefined,
          },
        });
      }),
    );
    dispatch({
      type: 'remove',
      payload: validatedClassesDataList.map(({ group }) => group.url),
      classesType: debouncedClassesType,
      weekDay: debouncedWeekDay,
      weekType: debouncedWeekType,
      date: debouncedStrDate,
    });
    updated.forEach(data => {
      if (!data) {
        return;
      }
      dispatch({
        type: 'init-defined',
        classesType: debouncedClassesType,
        group: data.group,
        weekDay: debouncedWeekDay,
        weekType: debouncedWeekType,
        date: debouncedStrDate,
        payload: data,
      });
    });
    setIsSaving(false);
  }

  useEffect(() => {
    if (
      groups &&
      prevDebouncedDate &&
      prevDebouncedClassesType &&
      prevDebouncedWeekDay &&
      prevDebouncedWeekType
    ) {
      dispatch({
        type: 'remove',
        payload: groups.flatMap(data => data.results).map(group => group.url),
        classesType: prevDebouncedClassesType,
        date: formatDate(prevDebouncedDate),
        weekDay: prevDebouncedWeekDay,
        weekType: prevDebouncedWeekType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedClassesType,
    debouncedDate,
    debouncedWeekDay,
    debouncedWeekType,
  ]);

  return (
    <>
      <Head>
        <title>Занятия</title>
      </Head>
      <AdminLayout>
        <div className="p-4">
          <div className="mb-5 rounded-md border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
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
                    <SelectWeekType
                      weekTypeId={weekType}
                      onSelect={setWeekType}
                    />
                  </div>
                </div>
              ) : (
                <DateField
                  disabled={isSaving}
                  date={date}
                  onDateChange={setDate}
                />
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
              .map((group, i, a) =>
                debouncedClassesType === 'main' ? (
                  <ClassesEditor
                    key={`${debouncedWeekType}${debouncedWeekDay}${group.id}`}
                    type={debouncedClassesType}
                    dispatch={action => {
                      dispatch({
                        classesType: debouncedClassesType,
                        weekDay: debouncedWeekDay,
                        weekType: debouncedWeekType,
                        group: group.url,
                        ...action,
                      });
                    }}
                    group={group}
                    classes={classesStore.get(
                      getClassesDataKey({
                        classesType: debouncedClassesType,
                        group: group.url,
                        weekDay: debouncedWeekDay,
                        weekType: debouncedWeekType,
                      }),
                    )}
                    searchParams={`?type=${debouncedClassesType}&week_day=${debouncedWeekDay}&week_type=${debouncedWeekType}`}
                    ref={a.length - 1 === i ? lastElementRef : null}
                  />
                ) : (
                  <ClassesEditor
                    key={`${debouncedStrDate}${group.id}`}
                    type={debouncedClassesType}
                    dispatch={action => {
                      dispatch({
                        classesType: debouncedClassesType,
                        date: debouncedStrDate,
                        group: group.url,
                        ...action,
                      });
                    }}
                    group={group}
                    classes={classesStore.get(
                      getClassesDataKey({
                        classesType: debouncedClassesType,
                        group: group.url,
                        date: debouncedStrDate,
                      }),
                    )}
                    searchParams={`?date=${debouncedStrDate}`}
                    ref={a.length - 1 === i ? lastElementRef : null}
                  />
                ),
              )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      date: getAppDate(),
    },
  };
};
