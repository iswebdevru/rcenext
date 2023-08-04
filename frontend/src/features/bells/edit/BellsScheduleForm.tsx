'use client';

import {
  formatPeriodTime,
  isBellsPeriodValid,
  useBellsStore,
} from '@/entities/bells';
import { Button, CheckboxField, TimeField } from '@/shared/ui/Controls';
import { FormEventHandler, useEffect, useState } from 'react';
import useSWR from 'swr';
import { ButtonCopyFromExisting } from './ButtonCopyFromExisting';
import { API_BELLS, BellsMixed, Hyperlink, apiBells } from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { useBellsScheduleEditFiltersStore } from './filters';

export function BellsForm() {
  const { type, variant, date, weekDay } = useBellsScheduleEditFiltersStore();

  const [periods, dispatch] = useBellsStore();
  const [bellsUrl, setBellsUrl] = useState<Hyperlink | null>(null);

  const preparedPeriods = periods
    .filter(isBellsPeriodValid)
    .map(formatPeriodTime);

  const handleDelete = () => {
    if (bellsUrl) {
      apiBells.delete(bellsUrl);
      dispatch({ type: 'init' });
      setBellsUrl(null);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();
    const data = await apiBells.create({
      type,
      variant,
      date: formatDate(date),
      week_day: weekDay,
      periods: preparedPeriods,
    } as any);
    if (data) {
      setBellsUrl(data.url);
      dispatch({
        type: 'load',
        payload: data.periods,
      });
    }
  };

  const { data } = useSWR<BellsMixed>(
    `${API_BELLS}?type=${type}&date=${formatDate(
      date,
    )}&week_day=${weekDay}&variant=${variant}`,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'load',
        payload: data.periods,
      });
      setBellsUrl(data.url);
    } else {
      dispatch({ type: 'init' });
      setBellsUrl(null);
    }
  }, [data, dispatch]);

  const cantSave = !preparedPeriods.length;
  const cantDelete = !bellsUrl;

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                  №
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                  Начало
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                  Конец
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                  С перерывом
                </th>
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr className="group" key={period.index}>
                  <td className="border-b border-zinc-200 px-6 py-4 align-top text-sm text-zinc-700 group-last:border-none dark:border-zinc-800 dark:text-zinc-400">
                    {period.index}
                  </td>
                  {period.has_break ? (
                    <>
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-800">
                        <div className="space-y-3">
                          <TimeField
                            value={period.period_from}
                            onChange={e =>
                              dispatch({
                                type: 'update-one',
                                payload: {
                                  index: period.index,
                                  period_from: e.currentTarget.value,
                                },
                              })
                            }
                          />
                          <TimeField
                            value={period.period_from_after}
                            onChange={e =>
                              dispatch({
                                type: 'update-one',
                                payload: {
                                  index: period.index,
                                  period_from_after: e.currentTarget.value,
                                },
                              })
                            }
                          />
                        </div>
                      </td>
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-800">
                        <div className="space-y-3">
                          <TimeField
                            value={period.period_to}
                            onChange={e =>
                              dispatch({
                                type: 'update-one',
                                payload: {
                                  index: period.index,
                                  period_to: e.currentTarget.value,
                                },
                              })
                            }
                          />
                          <TimeField
                            value={period.period_to_after}
                            onChange={e =>
                              dispatch({
                                type: 'update-one',
                                payload: {
                                  index: period.index,
                                  period_to_after: e.currentTarget.value,
                                },
                              })
                            }
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-800">
                        <TimeField
                          value={period.period_from}
                          onChange={e =>
                            dispatch({
                              type: 'update-one',
                              payload: {
                                index: period.index,
                                period_from: e.currentTarget.value,
                              },
                            })
                          }
                        />
                      </td>
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-800">
                        <TimeField
                          value={period.period_to}
                          onChange={e =>
                            dispatch({
                              type: 'update-one',
                              payload: {
                                index: period.index,
                                period_to: e.currentTarget.value,
                              },
                            })
                          }
                        />
                      </td>
                    </>
                  )}
                  <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-800">
                    <CheckboxField
                      name="with_break"
                      checked={period.has_break}
                      onChange={e =>
                        dispatch({
                          type: 'update-one',
                          payload: {
                            index: period.index,
                            has_break: e.currentTarget.checked,
                          },
                        })
                      }
                      label=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-4 border-t border-zinc-200 px-2 pt-4 dark:border-zinc-800">
          <ButtonCopyFromExisting
            date={date}
            onLoad={data => dispatch({ type: 'load', payload: data.periods })}
          />
          <div className="ml-auto">
            <Button
              variant="danger-outline"
              type="button"
              disabled={cantDelete}
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </div>
          <div>
            <Button variant="primary" type="submit" disabled={cantSave}>
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
