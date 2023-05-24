import {
  ClassesScheduleMixed,
  Hyperlink,
  WeekDay,
  WeekType,
} from '@/shared/api';
import { Reducer, useReducer } from 'react';

export type ClassesPartialPeriod = {
  index: number;
  subject: Hyperlink | null;
  teachers: Hyperlink[];
  cabinet: string | null;
};

export type ClassesData = {
  view: 'table' | 'message';
  message: string;
  periods: ClassesPartialPeriod[];
};

export type ClassesDataWithHistory = {
  init: ClassesData;
  draft: ClassesData;
};

export type ClassesMainDayStore = Map<number, ClassesDataWithHistory>;

export type ClassesMainStore = Map<string, ClassesMainDayStore>;

export type ClassesChangesDayStore = Map<number, ClassesDataWithHistory>;

export type ClassesChangesStore = Map<string, ClassesChangesDayStore>;

export type ClassesStore = {
  main: ClassesMainStore;
  changes: ClassesChangesStore;
};

export type ClassesStoreChangesAction = {
  classesType: 'changes';
  date: string;
  groupId: number;
};

export type ClassesStoreMainAction = {
  classesType: 'main';
  weekType: WeekType;
  weekDay: WeekDay;
  groupId: number;
};

export type ClassesStoreCommonAction =
  | ClassesStoreMainAction
  | ClassesStoreChangesAction;

export type ClassesStoreInitDefinedAction = {
  type: 'init-defined';
  payload: ClassesScheduleMixed;
};

export type ClassesStoreGuessedAction =
  | { type: 'init-empty' }
  | ClassesStoreInitDefinedAction
  | { type: 'change-view'; payload: 'table' | 'message' };

export type ClassesStoreAction =
  | ({
      type: 'init-empty';
    } & ClassesStoreCommonAction)
  | (ClassesStoreInitDefinedAction & ClassesStoreCommonAction)
  | ({
      type: 'change-view';
      payload: 'table' | 'message';
    } & ClassesStoreCommonAction);

const defaultClassesDataWithHistory: ClassesDataWithHistory = {
  init: {
    view: 'table',
    message: '',
    periods: [
      { index: 0, subject: null, cabinet: null, teachers: [] },
      { index: 1, subject: null, cabinet: null, teachers: [] },
      { index: 2, subject: null, cabinet: null, teachers: [] },
      { index: 3, subject: null, cabinet: null, teachers: [] },
      { index: 4, subject: null, cabinet: null, teachers: [] },
      { index: 5, subject: null, cabinet: null, teachers: [] },
      { index: 6, subject: null, cabinet: null, teachers: [] },
      { index: 7, subject: null, cabinet: null, teachers: [] },
    ],
  },
  draft: {
    view: 'table',
    message: '',
    periods: [
      { index: 0, subject: null, cabinet: null, teachers: [] },
      { index: 1, subject: null, cabinet: null, teachers: [] },
      { index: 2, subject: null, cabinet: null, teachers: [] },
      { index: 3, subject: null, cabinet: null, teachers: [] },
      { index: 4, subject: null, cabinet: null, teachers: [] },
      { index: 5, subject: null, cabinet: null, teachers: [] },
      { index: 6, subject: null, cabinet: null, teachers: [] },
      { index: 7, subject: null, cabinet: null, teachers: [] },
    ],
  },
};

export function getMainStoreKey(weekType: WeekType, weekDay: WeekDay) {
  return `${weekType}${weekDay}`;
}

function getKey(action: ClassesStoreAction) {
  return action.classesType === 'main'
    ? getMainStoreKey(action.weekType, action.weekDay)
    : action.date;
}

function createClassesDataWithHistoryFromPayload(
  action: ClassesStoreInitDefinedAction
): ClassesDataWithHistory {
  return {
    init: {
      view: action.payload.view,
      message: action.payload.view === 'message' ? action.payload.message : '',
      periods:
        action.payload.view === 'table'
          ? structuredClone(action.payload.periods)
          : structuredClone(defaultClassesDataWithHistory.init.periods),
    },
    draft: {
      view: action.payload.view,
      message: action.payload.view === 'message' ? action.payload.message : '',
      periods:
        action.payload.view === 'table'
          ? structuredClone(action.payload.periods)
          : structuredClone(defaultClassesDataWithHistory.init.periods),
    },
  };
}

const classesStoreReducer: Reducer<ClassesStore, ClassesStoreAction> = (
  state,
  action
) => {
  const clone = structuredClone(state);
  const key = getKey(action);
  switch (action.type) {
    case 'init-empty':
      const empty = structuredClone(defaultClassesDataWithHistory);
      if (clone[action.classesType].has(key)) {
        clone[action.classesType].get(key)!.set(action.groupId, empty);
      } else {
        clone[action.classesType].set(key, new Map([[action.groupId, empty]]));
      }
      return clone;
    case 'init-defined':
      const defined = createClassesDataWithHistoryFromPayload(action);
      if (clone[action.classesType].has(key)) {
        clone[action.classesType].get(key)!.set(action.groupId, defined);
      } else {
        clone[action.classesType].set(
          key,
          new Map([[action.groupId, defined]])
        );
      }
      return clone;
    case 'change-view':
      const data = clone[action.classesType].get(key)?.get(action.groupId);
      if (data) {
        data.draft.view = action.payload;
      }
      return clone;
    default:
      return state;
  }
};

export function useClassesStore() {
  return useReducer(classesStoreReducer, {
    main: new Map(),
    changes: new Map(),
  });
}
