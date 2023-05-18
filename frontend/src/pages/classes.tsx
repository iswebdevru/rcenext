import { useRef, useState } from 'react';
import { HUMAN_MONTHS } from '@/shared/constants';
import { getWeekType, WEEKDAYS_MAP } from '@/shared/lib/date';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Toggles } from '@/shared/ui/Toggles';
import { BaseLayout } from '@/layouts';
import { CollegeBlock, CollegeBlockToggles } from '@/entities/classes';
import { ClassesScheduleGrid } from '@/widgets/classes';
import { Button } from '@/shared/ui/Button';
import { clsx } from '@/shared/lib/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [isMobileFiltersOpened, setIsMobileFiltersOpened] = useState(false);
  const [collegeBlock, setCollegeBlock] = useState<CollegeBlock>(-1);
  const [isMixed, setIsMixed] = useState(true);
  const [groupSearch, setGroupSearch] = useState('');
  const mobileFiltersViewRef = useRef<HTMLDivElement>(null);

  const weekType = getWeekType(date);

  return (
    <BaseLayout>
      <div className="container flex gap-4 pt-6">
        <div className="grow">
          <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
            Расписание занятий на {date.getDate()}{' '}
            {HUMAN_MONTHS[date.getMonth()]} (
            {weekType === 'ЧИСЛ' ? 'Числитель' : 'Знаменатель'})
          </h1>
          {collegeBlock === -1 || collegeBlock === 1 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                1-5 корпус
              </h2>
              <ClassesScheduleGrid
                kind={isMixed ? 'mixed' : 'main'}
                collegeBlock={1}
                date={date}
                weekDay={WEEKDAYS_MAP[date.getDay()]}
                weekType={weekType}
              />
            </>
          ) : null}
          {collegeBlock === -1 || collegeBlock === 6 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                6 корпус
              </h2>
              <ClassesScheduleGrid
                kind={isMixed ? 'mixed' : 'main'}
                collegeBlock={6}
                date={date}
                weekDay={WEEKDAYS_MAP[date.getDay()]}
                weekType={weekType}
              />
            </>
          ) : null}
          {/* <button onClick={() => setOpened(p => !p)}>oopene</button> */}
        </div>
        <div className="flex-shrink-0">
          <div
            className={clsx({
              'fixed top-0 left-0 z-20 w-full h-full bg-zinc-900 lg:bg-opacity-100 lg:bg-transparent lg:static transition-colors duration-300':
                true,
              'bg-opacity-20': isMobileFiltersOpened,
              'bg-opacity-0 pointer-events-none': !isMobileFiltersOpened,
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
                'flex flex-col h-full max-w-xs gap-3 px-4 py-6 sm:px-6 sm:py-8 ml-auto overflow-y-auto bg-white dark:bg-zinc-800 dark:lg:bg-transparent lg:bg-transparent transition-[transform,opacity,box-shadow,opacity] duration-300 lg:p-0 lg:scale-y-100 lg:translate-x-0 lg:shadow-none lg:opacity-100':
                  true,
                'translate-x-0 scale-y-100 shadow-md opacity-100':
                  isMobileFiltersOpened,
                'translate-x-full scale-y-150 shadow-sm opacity-80':
                  !isMobileFiltersOpened,
              })}
              ref={mobileFiltersViewRef}
            >
              <Calendar date={date} setDate={setDate} />
              <CollegeBlockToggles
                value={collegeBlock}
                setValue={setCollegeBlock}
              />
              <Toggles value={isMixed} setValue={setIsMixed}>
                <Toggles.Variant value={false}>Основное</Toggles.Variant>
                <Toggles.Variant value={true}>С изменениями</Toggles.Variant>
              </Toggles>
              <InputSearch
                placeholder="Группа"
                value={groupSearch}
                onChange={e => setGroupSearch(e.currentTarget.value)}
              />
              <Button
                variant="primary"
                className="mt-auto"
                onClick={() => setIsMobileFiltersOpened(false)}
              >
                Закрыть
              </Button>
            </div>
          </div>
          <button
            className="fixed flex items-center justify-center bg-blue-600 rounded-full shadow-md shadow-blue-300 w-11 h-11 bottom-6 right-6 lg:hidden dark:bg-blue-700 dark:shadow-blue-700"
            onClick={() => setIsMobileFiltersOpened(true)}
          >
            <FontAwesomeIcon
              icon={faFilter}
              fixedWidth
              size="lg"
              className="text-blue-50 dark:text-blue-100"
            />
          </button>
        </div>
      </div>
    </BaseLayout>
  );
}
