import { useState } from 'react';
import { ClassesScheduleMixed, createClassesScheduleUrl } from '@/shared/api';
import { HUMAN_MONTHS } from '@/shared/constants';
import { usePaginatedFetch } from '@/shared/hooks';
import { getWeekType, WEEKDAYS_MAP } from '@/shared/lib/date';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Sidebar } from '@/shared/ui/Sidebar';
import { Toggles } from '@/shared/ui/Toggles';
import { BaseLayout } from '@/layouts';
import { ClassesScheduleCard } from '@/entities/classes';

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [opened, setOpened] = useState(false);
  const [blockType, setBlockType] = useState<'all' | 1 | 6>('all');
  const [withChanges, setWithChanges] = useState(true);
  const [groupSearch, setGroupSearch] = useState('');

  const weekType = getWeekType(date);

  const { data: firstBlockData, lastElementRef: firstBlockLastElementRef } =
    usePaginatedFetch<ClassesScheduleMixed>(
      blockType === 6
        ? null
        : createClassesScheduleUrl({
            withChanges,
            blockType: 1,
            date,
            weekDay: WEEKDAYS_MAP[date.getDay()],
            weekType,
          })
    );

  const { data: sixthBlockData, lastElementRef: sixthBlockLastElementRef } =
    usePaginatedFetch<ClassesScheduleMixed>(
      blockType === 1
        ? null
        : createClassesScheduleUrl({
            withChanges,
            blockType: 6,
            date,
            weekDay: WEEKDAYS_MAP[date.getDay()],
            weekType,
          })
    );

  return (
    <BaseLayout>
      <div className="container flex gap-4 pt-6">
        <div className="grow">
          <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
            Расписание занятий на {date.getDate()}{' '}
            {HUMAN_MONTHS[date.getMonth()]} (
            {weekType ? 'Числитель' : 'Знаменатель'})
          </h1>
          {blockType === 'all' || blockType === 1 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                1-5 корпус
              </h2>
              <div className="grid justify-between grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {firstBlockData
                  ?.map(page => page.results)
                  .flat()
                  .map((schedule, i, a) => (
                    <ClassesScheduleCard
                      key={schedule.url}
                      schedule={schedule}
                      ref={i === a.length - 1 ? firstBlockLastElementRef : null}
                    />
                  ))}
              </div>
            </>
          ) : null}
          {blockType === 'all' || blockType === 6 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                6 корпус
              </h2>
              <div className="grid justify-between grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {sixthBlockData
                  ?.map(page => page.results)
                  .flat()
                  .map((schedule, i, a) => (
                    <ClassesScheduleCard
                      key={schedule.url}
                      schedule={schedule}
                      ref={i === a.length - 1 ? sixthBlockLastElementRef : null}
                    />
                  ))}
              </div>
            </>
          ) : null}
          {/* <button onClick={() => setOpened(p => !p)}>oopene</button> */}
        </div>
        <div className="flex-shrink-0">
          <Sidebar opened={opened}>
            <div className="h-full">
              <div className="mb-3">
                <Calendar date={date} setDate={setDate} />
              </div>
              <div className="mb-3">
                <Toggles value={blockType} setValue={setBlockType}>
                  <Toggles.Variant value="all">Все</Toggles.Variant>
                  <Toggles.Variant value={1}>1-5</Toggles.Variant>
                  <Toggles.Variant value={6}>6</Toggles.Variant>
                </Toggles>
              </div>
              <div className="mb-3">
                <Toggles value={withChanges} setValue={setWithChanges}>
                  <Toggles.Variant value={false}>Основное</Toggles.Variant>
                  <Toggles.Variant value={true}>С изменениями</Toggles.Variant>
                </Toggles>
              </div>
              <InputSearch
                placeholder="Группа"
                value={groupSearch}
                onChange={e => setGroupSearch(e.currentTarget.value)}
              />
            </div>
          </Sidebar>
        </div>
      </div>
    </BaseLayout>
  );
}
