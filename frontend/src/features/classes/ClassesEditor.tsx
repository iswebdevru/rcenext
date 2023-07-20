import { ComponentProps, forwardRef, useRef, useState } from 'react';
import useSWR from 'swr';
import { ClassesScheduleChanges, Group, fetcher } from '@/shared/api';
import {
  faComment,
  faEllipsis,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubjectSelect } from '../subjects';
import { clsx } from '@/shared/lib/ui';
import {
  useClickOutside,
  withOutsideClickExceptionsContext,
} from '@/shared/hooks';
import { Button } from '@/shared/ui/Controls';
import {
  ClassesDataWithDraft,
  ClassesPartialPeriod,
  ClassesStoreAction,
  hasInitAndDraftDiff,
} from '@/entities/classes';
import { LoaderRect } from '@/shared/ui/Loader';

export const classPeriods = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type ClassesEditorProps = {
  searchParams: string;
  classes?: ClassesDataWithDraft;
  group: Group;
  dispatch: (value: ClassesStoreAction) => void;
};

export const ClassesEditor = forwardRef<HTMLDivElement, ClassesEditorProps>(
  function ClassesEditorComponent(
    { group, searchParams, classes, dispatch },
    ref,
  ) {
    const { isValidating } = useSWR<ClassesScheduleChanges>(
      `${group.classes}${searchParams}`,
      fetcher,
      {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        onError() {
          dispatch({
            type: 'init-empty',
            payload: {
              group: group.url,
            },
          });
        },
        onSuccess(data) {
          dispatch({
            type: 'init-defined',
            payload: {
              group: group.url,
              data: data as any,
            },
          });
        },
      },
    );

    const isChanged =
      classes && !isValidating ? hasInitAndDraftDiff(classes) : false;

    return (
      <div
        className="flex flex-col rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
        ref={ref}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {group.name}
          </div>
          {isChanged ? (
            <div className="ml-auto mr-4 rounded-md bg-blue-100 px-1.5 py-0.5 text-xs text-blue-500 dark:bg-zinc-700 dark:text-zinc-200">
              Изменено
            </div>
          ) : null}
          {classes && !isValidating ? (
            <Settings
              view={classes.draft.view}
              onViewChange={view =>
                dispatch({
                  type: 'change-view',
                  payload: { group: group.url, data: view },
                })
              }
            />
          ) : (
            <div className="h-7 w-7 overflow-hidden rounded-lg">
              <LoaderRect />
            </div>
          )}
        </div>
        {classes && !isValidating ? (
          classes.draft.view === 'table' ? (
            <ClassesTableView
              periods={classes.draft.periods}
              dispatch={dispatch}
              group={group}
            />
          ) : (
            <ClassesMessageView
              message={classes.draft.message}
              dispatch={dispatch}
              group={group}
            />
          )
        ) : (
          <TableLoader />
        )}
      </div>
    );
  },
);

type ModeButtonProps = { isActive?: boolean } & ComponentProps<'button'>;

type SettingsProps = {
  view: 'table' | 'message';
  onViewChange: (view: 'table' | 'message') => void;
};

const Settings = withOutsideClickExceptionsContext(function Settings({
  view,
  onViewChange,
}: SettingsProps) {
  const settingsRef = useRef<HTMLDivElement>(null);
  const [isSettingsOpened, setIsSettingsOpened] = useState(false);

  useClickOutside(settingsRef, () => setIsSettingsOpened(false));

  return (
    <div className="relative" ref={settingsRef}>
      <button
        className={clsx(
          'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-100 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-50',
          {
            'bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-50':
              isSettingsOpened,
            'text-zinc-500': !isSettingsOpened,
          },
        )}
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
        className={clsx(
          'absolute right-0 top-full mt-2 flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm transition-[opacity,transform] dark:border-zinc-700 dark:bg-zinc-800',
          {
            'opacity-1 z-10 translate-y-0 scale-100': isSettingsOpened,
            'pointer-events-none invisible -translate-y-12 scale-75 opacity-0':
              !isSettingsOpened,
          },
        )}
      >
        <div className="flex">
          <ModeButton
            className="h-10 flex-grow"
            isActive={view === 'table'}
            onClick={() => {
              onViewChange('table');
              setIsSettingsOpened(false);
            }}
          >
            <FontAwesomeIcon icon={faTable} fixedWidth />
          </ModeButton>
          <ModeButton
            className="h-10 flex-grow"
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
});

const ModeButton = forwardRef<HTMLButtonElement, ModeButtonProps>(
  function ModeButtonComponent(
    { children, className, isActive, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={clsx(
          className,
          'flex items-center justify-center transition duration-100',
          {
            'bg-blue-50 text-blue-500 dark:bg-zinc-700 dark:text-zinc-50':
              !!isActive,
            'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900  dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-50':
              !isActive,
          },
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

type ClassesTableViewProps = {
  periods: ClassesPartialPeriod[];
  group: Group;
  dispatch: (value: ClassesStoreAction) => void;
};

function ClassesTableView({ periods, dispatch, group }: ClassesTableViewProps) {
  return (
    <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 text-zinc-900 dark:border-zinc-700 dark:text-zinc-200">
            <th className="w-7 border-r border-zinc-200 px-1 py-0.5 text-sm font-semibold dark:border-zinc-700">
              №
            </th>
            <th className="border-r border-zinc-200 px-1 py-0.5 text-left text-sm font-semibold dark:border-zinc-700">
              Предмет
            </th>
            <th className="w-1/6 px-1 py-0.5 text-left text-sm font-semibold">
              Каб.
            </th>
          </tr>
          {periods.map(period => (
            <tr
              key={period.index}
              className="border-b border-zinc-200 last:border-b-0 dark:border-zinc-700"
            >
              <td className="border-r border-zinc-200 px-1 py-0.5 text-center text-sm text-zinc-500 dark:border-zinc-700">
                {period.index}
              </td>
              <td className="border-r border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                <SubjectSelect
                  selectedSubjectURL={period.subject}
                  onSelect={subject =>
                    dispatch({
                      type: 'change-period',
                      payload: {
                        group: group.url,
                        data: { index: period.index, subject },
                      },
                    })
                  }
                />
              </td>
              <td className="text-sm">
                <input
                  type="text"
                  name="cabinet"
                  className="w-full bg-transparent px-1 py-0.5 text-sm text-zinc-700 dark:text-zinc-300"
                  value={period.cabinet}
                  onChange={e => {
                    dispatch({
                      type: 'change-period',
                      payload: {
                        group: group.url,
                        data: {
                          index: period.index,
                          cabinet: e.currentTarget.value,
                        },
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
  group: Group;
  dispatch: (value: ClassesStoreAction) => void;
};

function ClassesMessageView({
  message,
  dispatch,
  group,
}: ClassesMessageViewProps) {
  return (
    <div className="shrink-0 flex-grow border-t border-zinc-200 p-2 dark:border-zinc-700">
      <textarea
        className="h-full w-full resize-none"
        value={message}
        onChange={e => {
          dispatch({
            type: 'change-message',
            payload: {
              group: group.url,
              data: e.currentTarget.value,
            },
          });
        }}
        placeholder="Сообщение вместо расписания"
      />
    </div>
  );
}

function TableLoader() {
  return (
    <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-700">
      <table className="w-full">
        <tbody>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th className="w-7 border-r border-zinc-200 px-1.5 py-1 text-sm font-semibold text-zinc-900 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="border-r border-zinc-200 px-1.5 py-1 text-left text-sm font-semibold text-zinc-900 dark:border-zinc-700">
              <div className="h-4 overflow-hidden rounded-md">
                <LoaderRect />
              </div>
            </th>
            <th className="w-1/6 px-1.5 py-1 text-left text-sm font-semibold text-zinc-900">
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
              <td className="border-r border-zinc-200 px-1.5 py-1 dark:border-zinc-700">
                <div className="h-4 overflow-hidden rounded-md">
                  <LoaderRect />
                </div>
              </td>
              <td className="border-r border-zinc-200 px-1.5 py-1 dark:border-zinc-700">
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
