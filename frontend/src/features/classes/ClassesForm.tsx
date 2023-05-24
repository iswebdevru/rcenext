import { ComponentProps, Dispatch, forwardRef, useRef, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { ClassesScheduleChanges, Group, fetcher } from '@/shared/api';
import {
  faComment,
  faEllipsis,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubjectSelect } from '../subjects';
import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { useClickOutside } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';
import {
  ClassesDataWithHistory,
  ClassesStoreGuessedAction,
  ClassesType,
} from '@/entities/classes';

export const classPeriods = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type ClassesFormProps = {
  type: ClassesType;
  group: Group;
  searchParams: string;
  classes?: ClassesDataWithHistory;
  dispatch: Dispatch<ClassesStoreGuessedAction>;
};

export const ClassesForm = forwardRef<HTMLDivElement, ClassesFormProps>(
  function ClassesFormComponent(
    { type, group, searchParams, classes, dispatch },
    ref
  ) {
    useSWRImmutable<ClassesScheduleChanges>(
      `${group.classes}${searchParams}`,
      fetcher,
      {
        shouldRetryOnError: false,
        onError() {
          dispatch({
            type: 'init-empty',
          });
        },
        onSuccess(data) {
          dispatch({
            type: 'init-defined',
            payload: data,
          });
        },
      }
    );
    return (
      <div
        className="bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        ref={ref}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-bold">{group.name}</div>
          {classes ? (
            <Settings
              view={classes.draft.view}
              onViewChange={view =>
                dispatch({ type: 'change-view', payload: view })
              }
            />
          ) : (
            <div className="overflow-hidden rounded-lg w-7 h-7">
              <Loader />
            </div>
          )}
        </div>
        {classes ? (
          classes.draft.view === 'table' ? (
            <div className="border-t shrink-0 border-zinc-200 dark:border-zinc-700">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-zinc-900 font-semibold border-r border-zinc-200 px-1 py-0.5 text-sm w-7 dark:border-zinc-700">
                      №
                    </th>
                    <th className="text-zinc-900 font-semibold text-left border-r border-zinc-200 px-1 text-sm py-0.5 dark:border-zinc-700">
                      Предмет
                    </th>
                    <th className="text-zinc-900 font-semibold text-left px-1 text-sm py-0.5 w-1/6">
                      Каб.
                    </th>
                  </tr>
                  {classPeriods.map(period => (
                    <tr
                      key={period}
                      className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
                    >
                      <td className="border-r border-zinc-200 text-center text-sm px-1 py-0.5 dark:border-zinc-700">
                        {period}
                      </td>
                      <td className="border-r border-zinc-200 dark:border-zinc-700">
                        <SubjectSelect
                          selectedSubjectURL={
                            classes!.draft.periods[period].subject
                          }
                          onSelect={selectedSubjectURL => {
                            // setPeriods(p => ({
                            //   ...p,
                            //   [period]: {
                            //     ...p[period],
                            //     subjectURL: selectedSubjectURL,
                            //   },
                            // }));
                          }}
                        />
                      </td>
                      <td className="text-sm">
                        <input
                          type="text"
                          className="w-full px-1 py-0.5 text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-2 border-t shrink-0 border-zinc-200 dark:border-zinc-700">
              <textarea className="w-full resize-none" name="" id=""></textarea>
            </div>
          )
        ) : (
          <TableLoader />
        )}
      </div>
    );
  }
);

type ModeButtonProps = { isActive?: boolean } & ComponentProps<'button'>;

type SettingsProps = {
  view: 'table' | 'message';
  onViewChange: (view: 'table' | 'message') => void;
};

function Settings({ view, onViewChange }: SettingsProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  useClickOutside(settingsRef, () => setIsSettingsOpened(false));

  return (
    <div className="relative" ref={settingsRef}>
      <button
        className={clsx({
          'flex items-center justify-center w-8 h-8 rounded-full hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-50':
            true,
          'text-zinc-900 bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50':
            isSettingsOpened,
          'text-zinc-500': !isSettingsOpened,
        })}
        onClick={() => setIsSettingsOpened(true)}
      >
        <FontAwesomeIcon
          icon={faEllipsis}
          fixedWidth
          size="lg"
          className="pointer-events-none"
        />
      </button>
      <div
        className={clsx({
          'absolute flex flex-col overflow-hidden bg-white border border-zinc-200 rounded-md right-0 top-full mt-2 shadow-sm transition-[opacity,transform] dark:bg-zinc-800 dark:border-zinc-700':
            true,
          'z-10 opacity-1 scale-100 translate-y-0': isSettingsOpened,
          'invisible pointer-events-none opacity-0 scale-75 -translate-y-12':
            !isSettingsOpened,
        })}
      >
        <div className="flex">
          <ModeButton
            className="flex-grow h-10"
            isActive={view === 'table'}
            onClick={() => {
              onViewChange('table');
              setIsSettingsOpened(false);
            }}
          >
            <FontAwesomeIcon icon={faTable} fixedWidth />
          </ModeButton>
          <ModeButton
            className="flex-grow h-10"
            isActive={view === 'message'}
            onClick={() => {
              onViewChange('message');
              setIsSettingsOpened(false);
            }}
          >
            <FontAwesomeIcon icon={faComment} fixedWidth />
          </ModeButton>
        </div>
        <div className="px-2 py-1.5">
          <Button className="w-full">Основное</Button>
        </div>
        <div className="px-2 py-1.5">
          <Button className="w-full">Сбросить</Button>
        </div>
        <div className="px-2 py-1.5">
          <Button className="w-full">Удалить</Button>
        </div>
      </div>
    </div>
  );
}

const ModeButton = forwardRef<HTMLButtonElement, ModeButtonProps>(
  function ModeButtonComponent(
    { children, className, isActive, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={classNameWithDefaults(
          clsx({
            'flex items-center justify-center transition duration-100': true,
            'bg-blue-50 text-blue-500 dark:bg-zinc-700 dark:text-zinc-50':
              !!isActive,
            'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-50':
              !isActive,
          }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

function TableLoader() {
  return (
    <div className="border-t shrink-0 border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-1 py-1 text-sm font-semibold border-r text-zinc-900 border-zinc-200 w-7 dark:border-zinc-700">
              <div className="h-5 overflow-hidden rounded-md">
                <Loader />
              </div>
            </th>
            <th className="px-1 py-1 text-sm font-semibold text-left border-r text-zinc-900 border-zinc-200 dark:border-zinc-700">
              <div className="h-5 overflow-hidden rounded-md">
                <Loader />
              </div>
            </th>
            <th className="w-1/6 px-1 py-1 text-sm font-semibold text-left text-zinc-900">
              <div className="h-5 overflow-hidden rounded-md">
                <Loader />
              </div>
            </th>
          </tr>
          {classPeriods.map(period => (
            <tr
              key={period}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <td className="px-1 py-1 border-r border-zinc-200 dark:border-zinc-700">
                <div className="h-5 overflow-hidden rounded-md">
                  <Loader />
                </div>
              </td>
              <td className="px-1 py-1 border-r border-zinc-200 dark:border-zinc-700">
                <div className="h-5 overflow-hidden rounded-md">
                  <Loader />
                </div>
              </td>
              <td className="px-1 py-1 dark:border-zinc-700">
                <div className="h-5 overflow-hidden rounded-md">
                  <Loader />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loader() {
  return (
    <div className="w-full h-full bg-zinc-200 animate-pulse dark:bg-zinc-700"></div>
  );
}
