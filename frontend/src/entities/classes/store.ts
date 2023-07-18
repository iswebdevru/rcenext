import {
  ClassesScheduleMessageView,
  ClassesScheduleTableView,
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
  payload: ClassesScheduleTableView | ClassesScheduleMessageView,
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
      clone.set(
        action.payload.group,
        structuredClone(defaultClassesDataWithHistory),
      );
      return clone;
    }
    case 'init-defined': {
      const clone = structuredClone(state);
      clone.set(
        action.payload.group,
        structuredClone(
          createClassesDataWithHistoryFromPayload(action.payload.data),
        ),
      );
      return clone;
    }
    case 'change-view': {
      const clone = structuredClone(state);
      const data = clone.get(action.payload.group);
      if (!data) {
        return state;
      }
      data.draft.view = action.payload.data;
      return clone;
    }
    case 'change-period': {
      const clone = structuredClone(state);
      const data = clone.get(action.payload.group);
      if (!data) {
        return state;
      }
      data.draft.periods = data.draft.periods.map(period => {
        if (action.payload.data.index !== period.index) {
          return period;
        }
        return {
          ...period,
          ...action.payload.data,
        };
      });
      return clone;
    }
    case 'change-message': {
      const clone = structuredClone(state);
      const data = clone.get(action.payload.group);
      if (!data) {
        return state;
      }
      data.draft.message = action.payload.data;
      return clone;
    }
    case 'remove': {
      const clone = structuredClone(state);
      action.payload.groups.forEach(group => {
        clone.delete(group);
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
