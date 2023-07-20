import {
  BellsAction,
  BellsPeriodEditing,
  formatPeriodTime,
  isBellsPeriodValid,
} from '@/entities/bells';
import { Button, CheckboxField, TimeField } from '@/shared/ui/Controls';
import { Dispatch, FormEventHandler } from 'react';
import { LoadExisting } from './LoadExisting';

export type BellsFormProps = {
  dispatch: Dispatch<BellsAction>;
  periods: BellsPeriodEditing[];
  onSave: (periods: BellsPeriodEditing[]) => void;
};

export function BellsForm({ dispatch, periods, onSave }: BellsFormProps) {
  const preparedPeriods = periods
    .filter(isBellsPeriodValid)
    .map(formatPeriodTime);

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    onSave(preparedPeriods);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md border border-zinc-200 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                  №
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                  Начало
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                  Конец
                </th>
                <th className="border-b border-zinc-200 px-6 py-4 text-left text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                  С перерывом
                </th>
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr className="group" key={period.index}>
                  <td className="border-b border-zinc-200 px-6 py-4 align-top text-sm text-zinc-700 group-last:border-none dark:border-zinc-700 dark:text-zinc-400">
                    {period.index}
                  </td>
                  {period.has_break ? (
                    <>
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-700">
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
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-700">
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
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-700">
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
                      <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-700">
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
                  <td className="border-b border-zinc-200 px-6 py-4 align-top group-last:border-none dark:border-zinc-700">
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
        <div className="flex items-center gap-4 border-t border-zinc-200 px-2 pt-4 dark:border-zinc-700">
          <LoadExisting
            onLoad={data => dispatch({ type: 'load', payload: data.periods })}
          />
          <div className="ml-auto">
            <Button variant="danger-outline" type="button" disabled>
              Удалить
            </Button>
          </div>
          <div>
            <Button
              variant="primary"
              type="submit"
              disabled={!preparedPeriods.length}
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
