import {
  ClassesScheduleMixed,
  Hyperlink,
  WeekDay,
  WeekType,
} from '@/shared/api';
import { Reducer, useReducer } from 'react';
import { withBlankPeriods } from './lib';
import {
  ClassesData,
  ClassesDataWithDraft,
  ClassesStore,
  ClassesStoreAction,
} from './types';
import { defaultClassesDataWithHistory, defaultPeriods } from './constants';

export type GetStoreKeyOptions = {
  group: Hyperlink;
} & (
  | {
      classesType: 'main';
      weekType: WeekType;
      weekDay: WeekDay;
    }
  | {
      classesType: 'changes';
      date: string;
    }
);

export function getClassesDataKey(options: GetStoreKeyOptions) {
  if (options.classesType === 'main') {
    return `main/${options.weekType}${options.weekDay}/${options.group}`;
  }
  return `changes/${options.date}/${options.group}`;
}

export function validateClassesDataDraft(data: ClassesData) {
  if (data.view === 'message') {
    return data.message.length > 0;
  }
  return data.periods.some(period => period.subject !== null);
}

export function hasInitAndDraftDiff(data: ClassesDataWithDraft) {
  if (data.init.view !== data.draft.view) {
    return true;
  }
  if (data.init.view === 'message') {
    return data.init.message !== data.draft.message;
  }
  return data.init.periods.some((_, i) => {
    if (data.init.periods[i].cabinet !== data.draft.periods[i].cabinet) {
      return true;
    }
    if (data.init.periods[i].subject !== data.draft.periods[i].subject) {
      return true;
    }
    if (
      data.init.periods[i].teachers.length !==
      data.draft.periods[i].teachers.length
    ) {
      return true;
    }
    return data.init.periods[i].teachers.some(
      teacher => !data.draft.periods[i].teachers.includes(teacher),
    );
  });
}

function createClassesDataWithHistoryFromPayload(
  payload: ClassesScheduleMixed,
): ClassesDataWithDraft {
  return {
    init: {
      view: payload.view,
      message: payload.view === 'message' ? payload.message : '',
      periods:
        payload.view === 'table'
          ? withBlankPeriods(payload.periods)
          : structuredClone(defaultPeriods),
    },
    draft: {
      view: payload.view,
      message: payload.view === 'message' ? payload.message : '',
      periods:
        payload.view === 'table'
          ? withBlankPeriods(payload.periods)
          : structuredClone(defaultPeriods),
    },
  };
}

const classesStoreReducer: Reducer<ClassesStore, ClassesStoreAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'init-empty': {
      const clone = structuredClone(state);
      const key = getClassesDataKey(action);
      clone.set(key, structuredClone(defaultClassesDataWithHistory));
      return clone;
    }
    case 'init-defined': {
      const clone = structuredClone(state);
      const key = getClassesDataKey(action);
      clone.set(
        key,
        structuredClone(
          createClassesDataWithHistoryFromPayload(action.payload),
        ),
      );
      return clone;
    }
    case 'change-view': {
      const clone = structuredClone(state);
      const key = getClassesDataKey(action);
      const data = clone.get(key);
      if (!data) {
        return state;
      }
      data.draft.view = action.payload;
      return clone;
    }
    case 'change-period': {
      const clone = structuredClone(state);
      const key = getClassesDataKey(action);
      const data = clone.get(key);
      if (!data) {
        return state;
      }
      data.draft.periods = data.draft.periods.map(period => {
        if (action.payload.index !== period.index) {
          return period;
        }
        return {
          ...period,
          ...action.payload,
        };
      });
      return clone;
    }
    case 'change-message': {
      const clone = structuredClone(state);
      const key = getClassesDataKey(action);
      const data = clone.get(key);
      if (!data) {
        return state;
      }
      data.draft.message = action.payload;
      return clone;
    }
    case 'remove': {
      const clone = structuredClone(state);
      action.payload.forEach(group => {
        const key = getClassesDataKey({ ...action, group });
        clone.delete(key);
      });
      return clone;
    }
    default:
      return state;
  }
};

export function useClassesStore() {
  return useReducer(classesStoreReducer, new Map());
}
