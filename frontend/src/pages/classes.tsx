import { useRef, useState } from 'react';
import { HUMAN_MONTHS } from '@/shared/constants';
import { WEEKDAYS_MAP, formatDate, getWeekType } from '@/shared/lib/date';
import { Calendar } from '@/shared/ui/calendar';
import { Toggles } from '@/shared/ui/Toggles';
import { BaseLayout } from '@/layouts';
import {
  ClassesScheduleCard,
  CollegeBlock,
  CollegeBlockToggles,
} from '@/entities/classes';
import { Button } from '@/shared/ui/Button';
import { clsx } from '@/shared/lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { GroupSelect } from '@/features/groups/GroupSelect';
import { API_CLASSES, ClassesScheduleMixed } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { LoaderCircle } from '@/shared/ui/Loader';

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [collegeBlock, setCollegeBlock] = useState<CollegeBlock>(-1);
  const [classesType, setClassesType] = useState<'mixed' | 'main'>('mixed');
  const [groupSearch, setGroupSearch] = useState('');

  const mobileFiltersViewRef = useRef<HTMLDivElement>(null);
  const [isMobileFiltersOpened, setIsMobileFiltersOpened] = useState(false);

  const weekType = getWeekType(date);
  const weekDay = WEEKDAYS_MAP[date.getDay()];

  const query = `${API_CLASSES}?type=${classesType}${
    classesType === 'main'
      ? `&week_type=${weekType}&week_day=${weekDay}`
      : `&date=${formatDate(date)}`
  }&search=${groupSearch}&block=${collegeBlock}`;

  const {
    data: classesSchedule,
    lastElementRef,
    isValidating,
  } = usePaginatedFetch<ClassesScheduleMixed>(query);

  return (
    <BaseLayout>
      <div className="container flex gap-4 pt-6">
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
            <div className="flex justify-center mt-4">
              <LoaderCircle />
            </div>
          ) : null}
        </div>
        <div className="flex-shrink-0">
          <div
            className={clsx({
              'fixed top-0 left-0 z-20 w-full h-full bg-black transition-colors duration-300 lg:transition-none lg:static lg:opacity-100 lg:visible lg:bg-transparent':
                true,
              'bg-opacity-50': isMobileFiltersOpened,
              'bg-opacity-0 invisible': !isMobileFiltersOpened,
            })}
            onClick={e => {
              if (
                !(e.target instanceof Node) ||
                !mobileFiltersViewRef.current?.contains(e.target)
              ) {
                setIsMobileFiltersOpened(false);
              }
            }}
          >
            <div
              className={clsx({
                'flex flex-col h-full max-w-xs gap-3 px-4 py-6 sm:px-6 sm:py-8 ml-auto overflow-y-auto lg:overflow-y-visible bg-white dark:bg-zinc-900 dark:lg:bg-transparent lg:bg-transparent transition-[transform,opacity] duration-300 lg:transition-none lg:px-2 lg:py-0 lg:opacity-100 lg:scale-y-100 lg:translate-x-0':
                  true,
                'translate-x-0 opacity-100': isMobileFiltersOpened,
                'translate-x-full opacity-0': !isMobileFiltersOpened,
              })}
              ref={mobileFiltersViewRef}
            >
              <Calendar date={date} setDate={setDate} />
              <CollegeBlockToggles
                value={collegeBlock}
                setValue={setCollegeBlock}
              />
              <Toggles value={classesType} setValue={setClassesType}>
                <Toggles.Variant value="main">Основное</Toggles.Variant>
                <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
              </Toggles>
              <GroupSelect
                searchStr={groupSearch}
                onSearchStrChange={e => setGroupSearch(e.target.value)}
                onSelect={group => setGroupSearch(group.name)}
              />
              <Button
                variant="primary"
                className="mt-auto lg:hidden"
                onClick={() => setIsMobileFiltersOpened(false)}
              >
                Закрыть
              </Button>
            </div>
          </div>
          <button
            className="fixed flex items-center justify-center text-white transition-colors bg-blue-500 rounded-full shadow-sm hover:text-zinc-100 hover:bg-blue-600 hover:shadow-md w-11 h-11 bottom-6 right-6 lg:hidden dark:bg-blue-700 dark:hover:bg-blue-900"
            onClick={() => setIsMobileFiltersOpened(true)}
          >
            <FontAwesomeIcon icon={faFilter} fixedWidth size="lg" />
          </button>
        </div>
      </div>
    </BaseLayout>
  );
}
