import { Dispatch, SetStateAction, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { Calendar } from '@/shared/ui/calendar';
import {
  Toggles,
  Button,
  SearchField,
  CheckboxField,
} from '@/shared/ui/Controls';
import { ClassesType } from '@/entities/classes';
import { GroupSelect } from '../groups';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import useTransition from 'react-transition-state';
import {
  useClickOutside,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';

export type ClassesFiltersProps = {
  date: Date;
  onDateChange: Dispatch<SetStateAction<Date>>;
  collegeBlock: number;
  onCollegeBlockChange: (collegeBlock: number) => void;
  classesType: ClassesType;
  onClassesTypeChange: (classesType: ClassesType) => void;
  groupSearch: string;
  onGroupSearchChange: (groupSearch: string) => void;
  cabinet: string;
  onCabinetChange: (cabinet: string) => void;
};

export const ClassesFilters = withOutsideClickExceptionsContext(
  function ClassesFilters(props: ClassesFiltersProps) {
    const mobileFiltersViewRef = useRef<HTMLDivElement>(null);

    const [transitionState, toggleTransition] = useTransition({
      timeout: 300,
      mountOnEnter: true,
      preEnter: true,
      unmountOnExit: true,
    });

    const zIndex = 30;

    const openFilters = () => {
      toggleTransition(true);
      document.body.style.overflow = 'hidden';
    };

    const closeFilters = () => {
      toggleTransition(false);
      document.body.style.overflow = '';
    };

    useClickOutside(mobileFiltersViewRef, closeFilters);

    return (
      <>
        <div className="hidden h-full lg:block">
          <Filters {...props} />
        </div>
        <FiltersButton onOpen={openFilters} />
        <ZIndex index={zIndex}>
          <Portal>
            <div
              style={{ zIndex }}
              className={clsx(
                'fixed left-0 top-0 h-full w-full overflow-hidden bg-black bg-opacity-0 transition-colors duration-300 lg:hidden',
                {
                  'sm:bg-opacity-50':
                    transitionState.status === 'entering' ||
                    transitionState.status === 'entered',
                  'sm:bg-opacity-0':
                    transitionState.status === 'preEnter' ||
                    transitionState.status === 'exiting',
                  hidden: transitionState.status === 'unmounted',
                },
              )}
            >
              <div
                className={clsx(
                  'ml-auto flex h-full flex-col items-center gap-6 overflow-y-auto bg-white px-6 py-8 transition-[transform,opacity] duration-300 dark:bg-zinc-900 sm:max-w-xs',
                  {
                    'translate-y-full opacity-0 sm:translate-x-full sm:translate-y-0':
                      transitionState.status === 'preEnter' ||
                      transitionState.status === 'exiting',
                    'translate-y-0 opacity-100 sm:translate-x-0':
                      transitionState.status === 'entering',
                  },
                )}
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
          </Portal>
        </ZIndex>
      </>
    );
  },
);

function Filters(props: ClassesFiltersProps) {
  return (
    <div className="space-y-4">
      <Calendar date={props.date} onDateChange={props.onDateChange} />
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
      <Toggles value={props.collegeBlock} onToggle={props.onCollegeBlockChange}>
        <Toggles.Variant value={-1}>Все</Toggles.Variant>
        <Toggles.Variant value={1}>1-5</Toggles.Variant>
        <Toggles.Variant value={6}>6</Toggles.Variant>
      </Toggles>
      <Toggles value={props.classesType} onToggle={props.onClassesTypeChange}>
        <Toggles.Variant value="main">Основное</Toggles.Variant>
        <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
      </Toggles>
      <CheckboxField label="Показывать звонки" />
    </div>
  );
}

type FiltersButtonProps = {
  onOpen: () => void;
};

const FiltersButton = withOutsideClickExceptionsContext(function FiltersButton({
  onOpen,
}: FiltersButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useRegisterOutsideClickException(ref);

  return (
    <Portal>
      <button
        ref={ref}
        className="fixed bottom-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition-colors hover:bg-blue-600 hover:text-zinc-100 hover:shadow-md dark:bg-blue-700 dark:hover:bg-blue-900 lg:hidden"
        onClick={onOpen}
      >
        <FontAwesomeIcon icon={faFilter} fixedWidth size="lg" />
      </button>
    </Portal>
  );
});
