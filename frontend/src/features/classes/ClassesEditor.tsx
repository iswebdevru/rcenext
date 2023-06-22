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
  ClassesPartialPeriod,
  ClassesStoreGroupAction,
  ClassesType,
  hasInitAndDraftDiff,
} from '@/entities/classes';
import { LoaderRect } from '@/shared/ui/Loader';

export const classPeriods = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type ClassesEditorProps = {
  type: ClassesType;
  group: Group;
  searchParams: string;
  classes?: ClassesDataWithHistory;
  dispatch: Dispatch<ClassesStoreGroupAction>;
};

export const ClassesEditor = forwardRef<HTMLDivElement, ClassesEditorProps>(
  function ClassesEditorComponent(
    { type, group, searchParams, classes, dispatch },
    ref
  ) {
    useSWRImmutable<ClassesScheduleChanges>(
      classes ? null : `${group.classes}${searchParams}`,
      fetcher,
      {
        revalidateOnMount: true,
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

    const isChanged = classes ? hasInitAndDraftDiff(classes) : false;

    return (
      <div
        className="flex flex-col bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        ref={ref}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {group.name}
          </div>
          {isChanged ? (
            <div className="ml-auto mr-4 text-xs bg-blue-100 text-blue-500 dark:bg-zinc-700 dark:text-zinc-200 rounded-md px-1.5 py-0.5">
              Изменено
            </div>
          ) : null}
          {classes ? (
            <Settings
              view={classes.draft.view}
              onViewChange={view =>
                dispatch({ type: 'change-view', payload: view })
              }
            />
          ) : (
            <div className="overflow-hidden rounded-lg w-7 h-7">
              <LoaderRect />
            </div>
          )}
        </div>
        {classes ? (
          classes.draft.view === 'table' ? (
            <ClassesTableView
              periods={classes.draft.periods}
              dispatch={dispatch}
            />
          ) : (
            <ClassesMessageView
              message={classes.draft.message}
              dispatch={dispatch}
            />
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

type ClassesTableViewProps = {
  periods: ClassesPartialPeriod[];
  dispatch: Dispatch<ClassesStoreGroupAction>;
};

function ClassesTableView({ periods, dispatch }: ClassesTableViewProps) {
  return (
    <div className="border-t shrink-0 border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b text-zinc-900 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700">
            <th className="font-semibold border-r border-zinc-200 px-1 py-0.5 text-sm w-7 dark:border-zinc-700">
              №
            </th>
            <th className="font-semibold text-left border-r border-zinc-200 px-1 text-sm py-0.5 dark:border-zinc-700">
              Предмет
            </th>
            <th className="font-semibold text-left px-1 text-sm py-0.5 w-1/6">
              Каб.
            </th>
          </tr>
          {periods.map(period => (
            <tr
              key={period.index}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <td className="text-zinc-500 border-r border-zinc-200 text-center text-sm px-1 py-0.5 dark:border-zinc-700">
                {period.index}
              </td>
              <td className="border-r text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700">
                <SubjectSelect
                  selectedSubjectURL={period.subject}
                  onSelect={subject =>
                    dispatch({
                      type: 'change-period',
                      payload: { index: period.index, subject },
                    })
                  }
                />
              </td>
              <td className="text-sm">
                <input
                  type="text"
                  name="cabinet"
                  className="w-full px-1 py-0.5 text-sm text-zinc-700 dark:text-zinc-300 bg-transparent"
                  value={period.cabinet}
                  onChange={e => {
                    dispatch({
                      type: 'change-period',
                      payload: {
                        index: period.index,
                        cabinet: e.currentTarget.value,
                      },
                    });
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ClassesMessageViewProps = {
  message: string;
  dispatch: Dispatch<ClassesStoreGroupAction>;
};

function ClassesMessageView({ message, dispatch }: ClassesMessageViewProps) {
  return (
    <div className="flex-grow p-2 border-t shrink-0 border-zinc-200 dark:border-zinc-700">
      <textarea
        className="w-full h-full resize-none"
        value={message}
        onChange={e => {
          dispatch({ type: 'change-message', payload: e.currentTarget.value });
        }}
        placeholder="Сообщение вместо расписания"
      />
    </div>
  );
}

function TableLoader() {
  return (
    <div className="border-t shrink-0 border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="px-1.5 py-1 text-sm font-semibold border-r text-zinc-900 border-zinc-200 w-7 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="px-1.5 py-1 text-sm font-semibold text-left border-r text-zinc-900 border-zinc-200 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="w-1/6 px-1.5 py-1 text-sm font-semibold text-left text-zinc-900">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
          </tr>
          {classPeriods.map(period => (
            <tr
              key={period}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <td className="px-1.5 py-1 border-r border-zinc-200 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
              <td className="px-1.5 py-1 border-r border-zinc-200 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
              <td className="px-1.5 py-1 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
