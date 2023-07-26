'use client';

import { useState } from 'react';
import { API_CLASSES, ClassesScheduleMixed, Paginated } from '@/shared/api';
import { HUMAN_MONTHS } from '@/shared/constants';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { WEEKDAYS_MAP, formatDate, getWeekType } from '@/shared/lib/date';
import { LoaderCircle } from '@/shared/ui/Loader';
import {
  ClassesScheduleCard,
  ClassesType,
  getClassesQueryParams,
} from '@/entities/classes';
import { ClassesFilters } from './ClassesFilters';

export type ClassesScheduleScreenProps = {
  initDate: string;
  classesScheduleFallback: Paginated<ClassesScheduleMixed>;
};

export function ClassesScheduleScreen({
  initDate,
}: ClassesScheduleScreenProps) {
  // State
  const [date, setDate] = useState(new Date(initDate));
  const [collegeBlock, setCollegeBlock] = useState<number>(-1);
  const [classesType, setClassesType] = useState<ClassesType>('mixed');
  const [groupName, setGroupName] = useState('');
  const [cabinet, setCabinet] = useState('');

  // Derived
  const weekType = getWeekType(date);
  const weekDay = WEEKDAYS_MAP[date.getDay()];

  const queryParams = getClassesQueryParams({
    classesType: useDebounce(classesType),
    weekDay: useDebounce(weekDay),
    weekType: useDebounce(weekType),
    date: useDebounce(formatDate(date)),
    collegeBlock: useDebounce(collegeBlock),
    groupName: useDebounce(groupName),
    cabinet: useDebounce(cabinet),
  });

  const {
    data: classesSchedule,
    lastElementRef,
    isValidating,
  } = usePaginatedFetch<ClassesScheduleMixed>(`${API_CLASSES}${queryParams}`);

  return (
    <div className="container gap-6 pt-6 lg:flex">
      <div className="grow">
        <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
          Расписание занятий на {date.getDate()} {HUMAN_MONTHS[date.getMonth()]}{' '}
          ({weekType === 'ЧИСЛ' ? 'Числитель' : 'Знаменатель'})
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
          groupSearch={groupName}
          onGroupSearchChange={setGroupName}
          cabinet={cabinet}
          onCabinetChange={setCabinet}
        />
      </div>
    </div>
  );
}
