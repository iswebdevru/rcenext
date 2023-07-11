import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { Calendar } from '@/shared/ui/calendar';
import { Toggles, Button } from '@/shared/ui/controls';
import { ClassesType } from '@/entities/classes';
import { GroupSelect } from '../groups';

export type ClassesFiltersProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  collegeBlock: number;
  onCollegeBlockChange: (collegeBlock: number) => void;
  classesType: ClassesType;
  onClassesTypeChange: (classesType: ClassesType) => void;
  groupSearch: string;
  groupSearchDebounced: string;
  onGroupSearchChange: (groupSearch: string) => void;
};

export function ClassesFilters(props: ClassesFiltersProps) {
  const mobileFiltersViewRef = useRef<HTMLDivElement>(null);
  const [isMobileFiltersOpened, setIsMobileFiltersOpened] = useState(false);

  return (
    <>
      <div
        className={clsx({
          'fixed left-0 top-0 z-20 h-full w-full bg-black transition-colors duration-300 lg:visible lg:static lg:bg-transparent lg:opacity-100 lg:transition-none':
            true,
          'bg-opacity-50': isMobileFiltersOpened,
          'invisible bg-opacity-0': !isMobileFiltersOpened,
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
            'ml-auto flex h-full max-w-xs flex-col gap-3 overflow-y-auto bg-white px-4 py-6 transition-[transform,opacity] duration-300 dark:bg-zinc-900 sm:px-6 sm:py-8 lg:translate-x-0 lg:scale-y-100 lg:overflow-y-visible lg:bg-transparent lg:px-2 lg:py-0 lg:opacity-100 lg:transition-none dark:lg:bg-transparent':
              true,
            'translate-x-0 opacity-100': isMobileFiltersOpened,
            'translate-x-full opacity-0': !isMobileFiltersOpened,
          })}
          ref={mobileFiltersViewRef}
        >
          <Calendar date={props.date} onDateChange={props.onDateChange} />
          <Toggles
            value={props.collegeBlock}
            onToggle={props.onCollegeBlockChange}
          >
            <Toggles.Variant value={-1}>Все</Toggles.Variant>
            <Toggles.Variant value={1}>1-5</Toggles.Variant>
            <Toggles.Variant value={6}>6</Toggles.Variant>
          </Toggles>
          <Toggles
            value={props.classesType}
            onToggle={props.onClassesTypeChange}
          >
            <Toggles.Variant value="main">Основное</Toggles.Variant>
            <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
          </Toggles>
          <GroupSelect
            groupSearch={props.groupSearch}
            groupSearchDebounced={props.groupSearchDebounced}
            onGroupSearchChange={props.onGroupSearchChange}
            onSelect={group => props.onGroupSearchChange(group.name)}
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
        className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 hover:text-zinc-100 hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-900 lg:hidden"
        onClick={() => setIsMobileFiltersOpened(true)}
      >
        <FontAwesomeIcon icon={faFilter} fixedWidth size="lg" />
      </button>
    </>
  );
}
