import { ClassesScheduleMixed, WeekDay, WeekType } from '@/shared/api';
import { Reducer, useReducer } from 'react';
import { withBlankPeriods } from './lib';
import {
  ClassesData,
  ClassesDataWithHistory,
  ClassesStore,
  ClassesStoreAction,
} from './types';
import { defaultClassesDataWithHistory, defaultPeriods } from './constants';

export function getMainStoreKey(weekType: WeekType, weekDay: WeekDay) {
  return `${weekType}${weekDay}`;
}

export type GetStoreKeyOptions =
  | {
      classesType: 'main';
      weekType: WeekType;
      weekDay: WeekDay;
    }
  | {
      classesType: 'changes';
      date: string;
    };

export function getStoreKey(options: GetStoreKeyOptions) {
  return options.classesType === 'main'
    ? getMainStoreKey(options.weekType, options.weekDay)
    : options.date;
}

export function validateClassesDataDraft(data: ClassesData) {
  if (data.view === 'message') {
    return data.message.length > 0;
  }
  return data.periods.some(period => period.subject !== null);
}

export function hasInitAndDraftDiff(data: ClassesDataWithHistory) {
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
      teacher => !data.draft.periods[i].teachers.includes(teacher)
    );
  });
}

function createClassesDataWithHistoryFromPayload(
  payload: ClassesScheduleMixed
): ClassesDataWithHistory {
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
  action
) => {
  switch (action.type) {
    case 'init-empty': {
      const clone = structuredClone(state);
      const key = getStoreKey(action);
      const data = structuredClone(defaultClassesDataWithHistory);
      if (clone[action.classesType].has(key)) {
        clone[action.classesType].get(key)!.set(action.group, data);
      } else {
        clone[action.classesType].set(key, new Map([[action.group, data]]));
      }
      return clone;
    }
    case 'init-defined': {
      const clone = structuredClone(state);
      const key = getStoreKey(action);
      const data = createClassesDataWithHistoryFromPayload(action.payload);
      if (clone[action.classesType].has(key)) {
        clone[action.classesType].get(key)!.set(action.group, data);
      } else {
        clone[action.classesType].set(key, new Map([[action.group, data]]));
      }
      return clone;
    }
    case 'change-view': {
      const clone = structuredClone(state);
      const key = getStoreKey(action);
      const data = clone[action.classesType].get(key)?.get(action.group);
      if (!data) {
        return state;
      }
      data.draft.view = action.payload;
      return clone;
    }
    case 'change-period': {
      const clone = structuredClone(state);
      const key = getStoreKey(action);
      const data = clone[action.classesType].get(key)?.get(action.group);
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
      const key = getStoreKey(action);
      const data = clone[action.classesType].get(key)?.get(action.group);
      if (!data) {
        return state;
      }
      data.draft.message = action.payload;
      return clone;
    }
    case 'remove': {
      const clone = structuredClone(state);
      const key = getStoreKey(action);
      const dayStore = clone[action.classesType].get(key);
      if (!dayStore) {
        return state;
      }
      action.payload.forEach(group => dayStore.delete(group));
      return clone;
    }
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
