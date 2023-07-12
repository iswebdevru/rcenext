import { useState } from 'react';
import { HUMAN_MONTHS } from '@/shared/constants';
import {
  WEEKDAYS_MAP,
  formatDate,
  getAppDate,
  getWeekType,
} from '@/shared/lib/date';
import { BaseLayout } from '@/layouts';
import {
  ClassesScheduleCard,
  ClassesType,
  getClassesQueryParams,
} from '@/entities/classes';
import { API_CLASSES, ClassesScheduleMixed } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { LoaderCircle } from '@/shared/ui/Loader';
import { ClassesFilters } from '@/features/classes';
import Head from 'next/head';

export default function Classes() {
  // State
  const [date, setDate] = useState(getAppDate);
  const [collegeBlock, setCollegeBlock] = useState<number>(-1);
  const [classesType, setClassesType] = useState<ClassesType>('mixed');
  const [groupSearch, setGroupSearch] = useState('');
  const weekType = getWeekType(date);
  const weekDay = WEEKDAYS_MAP[date.getDay()];
  const dateStr = formatDate(date);

  // Debounced
  const groupSearchDebounced = useDebounce(groupSearch);

  const queryParams = getClassesQueryParams({
    classesType,
    weekDay,
    weekType,
    date: dateStr,
    groupSearch: groupSearchDebounced,
    collegeBlock,
  });

  const {
    data: classesSchedule,
    lastElementRef,
    isValidating,
  } = usePaginatedFetch<ClassesScheduleMixed>(`${API_CLASSES}${queryParams}`);

  return (
    <>
      <Head>
        <title>Расписание занятий</title>
      </Head>
      <BaseLayout>
        <div className="container gap-6 pt-6 lg:flex">
          <div className="grow">
            <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
              Расписание занятий на {date.getDate()}{' '}
              {HUMAN_MONTHS[date.getMonth()]} (
              {weekType === 'ЧИСЛ' ? 'Числитель' : 'Знаменатель'})
            </h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {classesSchedule
                ?.flatMap(page => page.results)
                .map((schedule, i, a) => (
                  <ClassesScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    ref={a.length - 1 === i ? lastElementRef : null}
                  />
                ))}
            </div>
            {isValidating ? (
              <div className="mt-4 flex justify-center">
                <LoaderCircle />
              </div>
            ) : null}
          </div>
          <div className="flex-shrink-0">
            <ClassesFilters
              date={date}
              onDateChange={setDate}
              classesType={classesType}
              onClassesTypeChange={setClassesType}
              collegeBlock={collegeBlock}
              onCollegeBlockChange={setCollegeBlock}
              groupSearch={groupSearch}
              onGroupSearchChange={setGroupSearch}
              groupSearchDebounced={groupSearchDebounced}
            />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}
