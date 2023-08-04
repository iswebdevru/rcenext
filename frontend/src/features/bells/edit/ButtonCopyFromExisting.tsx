import { API_BELLS, BellsMixed, WeekDay } from '@/shared/api';
import {
  useClickOutside,
  useDebounce,
  usePositionCoords,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { formatDate } from '@/shared/lib/date';
import { clsx } from '@/shared/lib/ui';
import { Button, Toggles } from '@/shared/ui/Controls';
import { SelectWeekDay } from '@/shared/ui/Select';
import { Portal, useZIndex } from '@/shared/ui/Utils';
import { DateField } from '@/shared/ui/Calendar';
import { useEffect, useRef, useState } from 'react';
import useTransition from 'react-transition-state';
import useSWR from 'swr';

export type ButtonCopyFromExistingProps = {
  onLoad: (data: BellsMixed) => void;
  date: Date;
};

export const ButtonCopyFromExisting = withOutsideClickExceptionsContext(
  function ButtonCopyFromExisting({
    onLoad,
    date: initDate,
  }: ButtonCopyFromExistingProps) {
    const [bellsType, setBellsType] = useState('main');
    const [bellsVariant, setBellsVariant] = useState('normal');
    const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
    const [date, setDate] = useState<Date>(initDate);

    const debouncedBellsType = useDebounce(bellsType);
    const debouncedBellsVariant = useDebounce(bellsVariant);
    const debouncedWeekDay = useDebounce(weekDay);
    const debouncedDate = useDebounce(date);

    const btnRef = useRef<HTMLButtonElement>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const [{ isMounted, status }, toggleTransition] = useTransition({
      timeout: 300,
      mountOnEnter: true,
      preEnter: true,
      unmountOnExit: true,
    });
    const zIndex = useZIndex();
    const { left, top, recalculatePosition } = usePositionCoords(
      btnRef,
      componentRef,
    );

    const { data } = useSWR<BellsMixed>(
      isMounted
        ? `${API_BELLS}?type=${debouncedBellsType}&week_day=${debouncedWeekDay}&date=${formatDate(
            debouncedDate,
          )}&variant=${debouncedBellsVariant}`
        : null,
      {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
      },
    );

    const handleLoad = () => {
      if (data) {
        onLoad(data);
        toggleTransition(false);
      }
    };

    useClickOutside(componentRef, () => toggleTransition(false));
    useRegisterOutsideClickException(btnRef);
    useEffect(() => {
      if (isMounted) {
        setTimeout(recalculatePosition, 0);
      }
    }, [isMounted, recalculatePosition]);

    const cantSave = !data;

    return (
      <div>
        <Button
          type="button"
          onClick={() => {
            toggleTransition();
          }}
          ref={btnRef}
        >
          Загрузить
        </Button>
        <Portal>
          {isMounted ? (
            <div style={{ zIndex, left, top }} className="fixed">
              <div
                ref={componentRef}
                className={clsx(
                  'rounded-md border border-zinc-200 bg-white p-2 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-950',
                  {
                    '-translate-y-2 opacity-0':
                      status === 'preEnter' || status === 'exiting',
                    'translate-y-0 opacity-100': status === 'entering',
                  },
                )}
              >
                <div className="mb-6 space-y-3">
                  <div>
                    <Toggles value={bellsType} onToggle={setBellsType}>
                      <Toggles.Variant value="main">Основной</Toggles.Variant>
                      <Toggles.Variant value="changes">
                        Изменения
                      </Toggles.Variant>
                    </Toggles>
                  </div>
                  <div>
                    <Toggles value={bellsVariant} onToggle={setBellsVariant}>
                      <Toggles.Variant value="normal">Обычный</Toggles.Variant>
                      <Toggles.Variant value="reduced">
                        Сокращенный
                      </Toggles.Variant>
                    </Toggles>
                  </div>
                  <div>
                    {bellsType === 'main' ? (
                      <SelectWeekDay
                        weekDayId={weekDay}
                        onSelect={setWeekDay}
                      />
                    ) : (
                      <DateField date={date} onDateChange={setDate} />
                    )}
                  </div>
                </div>
                <Button
                  variant="primary"
                  disabled={cantSave}
                  onClick={handleLoad}
                >
                  Загрузить
                </Button>
              </div>
            </div>
          ) : null}
        </Portal>
      </div>
    );
  },
);
