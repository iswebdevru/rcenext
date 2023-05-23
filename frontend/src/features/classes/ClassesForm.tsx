import { ComponentProps, forwardRef, useRef, useState } from 'react';
import useSWR from 'swr';
import { Group, Hyperlink, fetcher } from '@/shared/api';
import {
  faComment,
  faEllipsis,
  faTable,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SubjectSelect } from '../subjects';
import { ClassesType } from '@/entities/classes';
import { classNameWithDefaults, clsx } from '@/shared/lib/ui';
import { useClickOutside } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';

export const classPeriods = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export type ClassPeriod = { subject: string | null; cabinet: string | null };

export type ClassesData = {
  responseType: 'table' | 'message';
  periods: ClassPeriod[];
  message: string | null;
};

export type ClassesHistoryData = {
  prev: ClassesData | null;
  current: ClassesData | null;
};

export type ClassesDayStore = Map<string, ClassesHistoryData>;

export type ClassesStore = Map<string, ClassesDayStore>;

export type ClassesFormProps = {
  classesData?: ClassesData | null;
  classesType: ClassesType;
  group: Hyperlink;
};

// const defaultPeriods = {
//   0: { subjectURL: null, cabinet: null },
//   1: { subjectURL: null, cabinet: null },
//   2: { subjectURL: null, cabinet: null },
//   3: { subjectURL: null, cabinet: null },
//   4: { subjectURL: null, cabinet: null },
//   5: { subjectURL: null, cabinet: null },
//   6: { subjectURL: null, cabinet: null },
//   7: { subjectURL: null, cabinet: null },
// } as const;

export const ClassesForm = forwardRef<HTMLDivElement, ClassesFormProps>(
  function ClassesFormComponent({ group, classesType, classesData }, ref) {
    const settingsRef = useRef<HTMLDivElement>(null);
    const [isSettingsOpened, setIsSettingsOpened] = useState(false);

    const { data: groupData } = useSWR<Group>(group, fetcher);

    useClickOutside(settingsRef, () => setIsSettingsOpened(false));

    return (
      <div
        className="bg-white border rounded-md border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
        ref={ref}
      >
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-sm font-bold">
            {groupData?.name ?? (
              <div className="w-16 h-5 overflow-hidden rounded-md">
                <Loader />
              </div>
            )}
          </div>
          {classesData ? (
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
                    isActive={classesData.responseType === 'table'}
                    onClick={() => {
                      // setResponseType('table');
                      setIsSettingsOpened(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faTable} fixedWidth />
                  </ModeButton>
                  <ModeButton
                    className="flex-grow h-10"
                    isActive={classesData.responseType === 'message'}
                    onClick={() => {
                      // setResponseType('message');
                      setIsSettingsOpened(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faComment} fixedWidth />
                  </ModeButton>
                </div>
                <div className="p-2">
                  <Button>Основное</Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg w-7 h-7">
              <Loader />
            </div>
          )}
        </div>
        {classesData ? (
          classesData.responseType === 'table' ? (
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
                            classesData.periods[period].subject
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
