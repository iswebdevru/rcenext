import { API_BELLS, BellsMixed, WeekDay, fetcher } from '@/shared/api';
import {
  useClickOutside,
  usePositionCoords,
  useRegisterOutsideClickException,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { formatDate } from '@/shared/lib/date';
import { clsx } from '@/shared/lib/ui';
import { Button, Toggles } from '@/shared/ui/Controls';
import { SelectWeekDay } from '@/shared/ui/Select';
import { Portal, useZIndex } from '@/shared/ui/Utils';
import { DateField } from '@/shared/ui/calendar';
import { useEffect, useRef, useState } from 'react';
import useTransition from 'react-transition-state';
import useSWR from 'swr';

export type LoadExisting = {
  onLoad: (data: BellsMixed) => void;
};

export const LoadExisting = withOutsideClickExceptionsContext(
  function LoadExisting({ onLoad }: LoadExisting) {
    const [shouldLoad, setShouldLoad] = useState(false);
    const [bellsType, setBellsType] = useState('main');
    const [bellsVariant, setBellsVariant] = useState('normal');
    const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
    const [date, setDate] = useState<Date | null>(null);

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

    const handleLoad = () => {
      setShouldLoad(true);
      toggleTransition(false);
    };

    useClickOutside(componentRef, () => toggleTransition(false));
    useRegisterOutsideClickException(btnRef);
    useEffect(() => {
      if (isMounted) {
        recalculatePosition();
      }
    }, [isMounted, recalculatePosition]);
    useEffect(() => {
      setDate(new Date());
    }, []);

    useSWR<BellsMixed>(
      shouldLoad
        ? `${API_BELLS}?type=${bellsType}&week_day=${weekDay}&date=${formatDate(
            date!,
          )}&variant=${bellsVariant}`
        : null,
      fetcher,
      {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        onSuccess(data) {
          onLoad(data);
          setShouldLoad(false);
        },
        onError() {
          setShouldLoad(true);
          console.log('Not found');
        },
      },
    );

    return (
      <div>
        <Button
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
                  'rounded-md border border-zinc-200 p-2 transition dark:border-zinc-700 dark:bg-zinc-800',
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
                    ) : date ? (
                      <DateField date={date} onDateChange={setDate as any} />
                    ) : null}
                  </div>
                </div>
                <Button variant="primary" onClick={handleLoad}>
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
