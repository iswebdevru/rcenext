import {
  ClassesScheduleMixed,
  Hyperlink,
  WeekDay,
  WeekType,
} from '@/shared/api';

// Store related types
export type ClassesPartialPeriod = {
  index: number;
  subject: Hyperlink | null;
  teachers: Hyperlink[];
  cabinet: string;
};
export type ClassesUpdatePeriod = {
  index: number;
  subject?: Hyperlink | null;
  teachers?: Hyperlink[];
  cabinet?: string;
};
export type ClassesData = {
  view: 'table' | 'message';
  message: string;
  periods: ClassesPartialPeriod[];
};
export type ClassesDataWithDraft = {
  init: ClassesData;
  draft: ClassesData;
};
export type ClassesStore = Map<string, ClassesDataWithDraft>;

/**
 *
 * Map
 * key => value
 *
 * main:
 * key: main/date/group/init
 * key: main/date/group/draft
 *
 * changes:
 * key: changes/date/
 */

// Actions
export type ClassesChangesStoreAction = {
  classesType: 'changes';
  date: string;
};
export type ClassesMainStoreAction = {
  classesType: 'main';
  weekType: WeekType;
  weekDay: WeekDay;
};
export type ClassesStoreGroupActionBase = { group: Hyperlink };

export type ClassesStoreInitEmptyAction = {
  type: 'init-empty';
};
export type ClassesStoreInitDefinedAction = {
  type: 'init-defined';
  payload: ClassesScheduleMixed;
};
export type ClassesStoreChangeViewAction = {
  type: 'change-view';
  payload: 'table' | 'message';
};
export type ClassesStoreChangePeriodAction = {
  type: 'change-period';
  payload: ClassesUpdatePeriod;
};
export type ClassesStoreChangeMessageAction = {
  type: 'change-message';
  payload: string;
};
export type ClassesStoreRemoveAction = {
  type: 'remove';
  payload: Hyperlink[];
};
export type ClassesStoreGroupAction =
  | ClassesStoreInitEmptyAction
  | ClassesStoreInitDefinedAction
  | ClassesStoreChangeViewAction
  | ClassesStoreChangePeriodAction
  | ClassesStoreChangeMessageAction;

export type ClassesStoreAction =
  | (
      | (ClassesStoreGroupAction & ClassesStoreGroupActionBase)
      | ClassesStoreRemoveAction
    ) &
      (ClassesMainStoreAction | ClassesChangesStoreAction);
