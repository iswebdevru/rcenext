import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { Calendar } from '@/shared/ui/calendar';
import { Toggles, Button, SearchField } from '@/shared/ui/controls';
import { ClassesType } from '@/entities/classes';
import { GroupSelect } from '../groups';
import { Portal, ZIndex } from '@/shared/ui/utils';
import useTransition from 'react-transition-state';

export type ClassesFiltersProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  collegeBlock: number;
  onCollegeBlockChange: (collegeBlock: number) => void;
  classesType: ClassesType;
  onClassesTypeChange: (classesType: ClassesType) => void;
  groupSearch: string;
  onGroupSearchChange: (groupSearch: string) => void;
  cabinet: string;
  onCabinetChange: (cabinet: string) => void;
};

export function ClassesFilters(props: ClassesFiltersProps) {
  const mobileFiltersViewRef = useRef<HTMLDivElement>(null);

  const [transitionState, toggleTransition] = useTransition({
    timeout: 300,
    mountOnEnter: true,
    preEnter: true,
    unmountOnExit: true,
  });

  const zIndex = 20;

  const openFilters = () => {
    toggleTransition(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFilters = () => {
    toggleTransition(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <div className="hidden h-full lg:block">
        <Filters {...props} />
      </div>
      <FiltersButton onOpen={openFilters} />
      <ZIndex index={zIndex}>
        <Portal>
          {transitionState.isMounted ? (
            <div
              style={{ zIndex }}
              className={clsx({
                'fixed left-0 top-0 h-full w-full overflow-hidden bg-black transition-colors duration-300 lg:hidden':
                  true,
                'bg-opacity-50':
                  transitionState.status === 'entering' ||
                  transitionState.status === 'entered',
                'bg-opacity-0':
                  transitionState.status === 'preEnter' ||
                  transitionState.status === 'exiting',
              })}
              onClick={e => {
                if (
                  !(e.target instanceof Node) ||
                  !mobileFiltersViewRef.current?.contains(e.target)
                ) {
                  closeFilters();
                }
              }}
            >
              <div
                className={clsx({
                  'ml-auto flex h-full flex-col items-center gap-6 overflow-y-auto bg-white px-6 py-8 transition-[transform,opacity] duration-300 dark:bg-zinc-900 sm:max-w-xs':
                    true,
                  'translate-y-full opacity-0 sm:translate-x-full sm:translate-y-0':
                    transitionState.status === 'preEnter' ||
                    transitionState.status === 'exiting',
                  'translate-y-0 opacity-100 sm:translate-x-0':
                    transitionState.status === 'entering',
                })}
                ref={mobileFiltersViewRef}
              >
                <div className="w-full max-w-xs">
                  <Filters {...props} />
                </div>
                <div className="mt-auto w-full max-w-xs lg:hidden">
                  <Button variant="primary" onClick={closeFilters}>
                    Закрыть
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </Portal>
      </ZIndex>
    </>
  );
}

function Filters(props: ClassesFiltersProps) {
  return (
    <div className="space-y-4">
      <Calendar date={props.date} onDateChange={props.onDateChange} />
      <Toggles value={props.collegeBlock} onToggle={props.onCollegeBlockChange}>
        <Toggles.Variant value={-1}>Все</Toggles.Variant>
        <Toggles.Variant value={1}>1-5</Toggles.Variant>
        <Toggles.Variant value={6}>6</Toggles.Variant>
      </Toggles>
      <Toggles value={props.classesType} onToggle={props.onClassesTypeChange}>
        <Toggles.Variant value="main">Основное</Toggles.Variant>
        <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
      </Toggles>
      <GroupSelect
        groupSearch={props.groupSearch}
        onGroupSearchChange={props.onGroupSearchChange}
        onSelect={group => props.onGroupSearchChange(group.name)}
      />
      <SearchField
        name="cabinet"
        autoComplete="off"
        placeholder="Кабинет"
        value={props.cabinet}
        onChange={e => props.onCabinetChange(e.currentTarget.value)}
      />
    </div>
  );
}

type FiltersButtonProps = {
  onOpen: () => void;
};

function FiltersButton({ onOpen }: FiltersButtonProps) {
  return (
    <Portal>
      <button
        className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 hover:text-zinc-100 hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-900 lg:hidden"
        onClick={onOpen}
      >
        <FontAwesomeIcon icon={faFilter} fixedWidth size="lg" />
      </button>
    </Portal>
  );
}
