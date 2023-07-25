import { forwardRef, useEffect } from 'react';
import useSWR from 'swr';
import {
  ApiError,
  ClassesScheduleChanges,
  Group,
  apiClasses,
} from '@/shared/api';
import {
  ClassesDataWithDraft,
  ClassesStoreAction,
  hasInitAndDraftDiff,
} from '@/entities/classes';
import { LoaderRect } from '@/shared/ui/Loader';
import { TableLoader } from './TableLoader';
import { ClassesMessageView } from './ClassesMessageView';
import { ClassesTableView } from './ClassesTableView';
import { ClassesEditorSettings } from './ClassesEditorSettings';

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
    const { isValidating, data, error, mutate } = useSWR<
      ClassesScheduleChanges,
      ApiError<unknown>
    >(`${group.classes}${searchParams}`, {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    });

    const handleDelete = async () => {
      if (classes?.url) {
        await apiClasses.delete(classes.url);
        await mutate();
      }
    };

    const handleReset = () => {
      dispatch({ type: 'reset', payload: { group: group.url } });
    };

    useEffect(() => {
      if (error) {
        dispatch({
          type: 'init-empty',
          payload: { group: group.url },
        });
      } else if (data) {
        dispatch({
          type: 'init-defined',
          payload: {
            group: group.url,
            data: data,
          },
        });
      }
    }, [data, error, dispatch, group.url]);

    const isChanged =
      classes && !isValidating ? hasInitAndDraftDiff(classes) : false;

    const cantDelete = !classes?.url;
    const cantReset = false;

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
            <ClassesEditorSettings
              view={classes.draft.view}
              onViewChange={view =>
                dispatch({
                  type: 'change-view',
                  payload: { group: group.url, data: view },
                })
              }
              onDelete={handleDelete}
              deleteDisabled={cantDelete}
              onReset={handleReset}
              resetDisabled={cantReset}
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
