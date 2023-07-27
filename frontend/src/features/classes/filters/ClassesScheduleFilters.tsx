'use client';

import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { clsx } from '@/shared/lib/ui';
import { Calendar } from '@/shared/ui/Calendar';
import {
  Toggles,
  Button,
  SearchField,
  CheckboxField,
} from '@/shared/ui/Controls';
import { GroupSelect } from '../../groups';
import { Portal, ZIndex } from '@/shared/ui/Utils';
import useTransition from 'react-transition-state';
import {
  useClickOutside,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { useClassesScheduleFiltersStore } from './store';

export const ClassesScheduleFilters = withOutsideClickExceptionsContext(
  function ClassesScheduleFilters() {
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
          <Filters />
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
                  <Filters />
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

function Filters() {
  return (
    <div className="space-y-4">
      <DateFilter />
      <GroupFilter />
      <CabinetFilter />
      <CollegeBlockFilter />
      <ClassesScheduleTypeFilter />
      <CheckboxField label="Показывать звонки" />
    </div>
  );
}

function DateFilter() {
  const date = useClassesScheduleFiltersStore(state => state.date);
  const onChange = useClassesScheduleFiltersStore(state => state.changeDate);

  return <Calendar date={date} onDateChange={onChange} />;
}

function GroupFilter() {
  const groupName = useClassesScheduleFiltersStore(state => state.groupName);
  const onChange = useClassesScheduleFiltersStore(
    state => state.changeGroupName,
  );

  return (
    <GroupSelect
      groupSearch={groupName}
      onGroupSearchChange={onChange}
      onSelect={group => onChange(group.name)}
    />
  );
}

function CabinetFilter() {
  const cabinet = useClassesScheduleFiltersStore(state => state.cabinet);
  const onChange = useClassesScheduleFiltersStore(state => state.changeCabinet);

  return (
    <SearchField
      name="cabinet"
      autoComplete="off"
      placeholder="Кабинет"
      value={cabinet}
      onChange={e => onChange(e.currentTarget.value)}
    />
  );
}

function CollegeBlockFilter() {
  const block = useClassesScheduleFiltersStore(state => state.block);
  const onChange = useClassesScheduleFiltersStore(state => state.changeBlock);

  return (
    <Toggles value={block} onToggle={onChange}>
      <Toggles.Variant value={-1}>Все</Toggles.Variant>
      <Toggles.Variant value={1}>1-5</Toggles.Variant>
      <Toggles.Variant value={6}>6</Toggles.Variant>
    </Toggles>
  );
}

function ClassesScheduleTypeFilter() {
  const type = useClassesScheduleFiltersStore(state => state.type);
  const onChange = useClassesScheduleFiltersStore(state => state.changeType);

  return (
    <Toggles value={type} onToggle={onChange}>
      <Toggles.Variant value="main">Основное</Toggles.Variant>
      <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
    </Toggles>
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
