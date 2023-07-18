import {
  ClassesScheduleMessageView,
  ClassesScheduleTableView,
  Hyperlink,
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
export type ClassesStore = Map<Hyperlink, ClassesDataWithDraft>;

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
export type ClassesStoreGroupActionPayload<T = undefined> = {
  group: Hyperlink;
} & (T extends undefined ? {} : { data: T });
export type ClassesStoreGroupsActionPayload<T = undefined> = {
  groups: Hyperlink[];
} & (T extends undefined ? {} : { data: T });

export type ClassesStoreInitEmptyAction = {
  type: 'init-empty';
  payload: ClassesStoreGroupActionPayload;
};
export type ClassesStoreInitDefinedAction = {
  type: 'init-defined';
  payload: ClassesStoreGroupActionPayload<
    ClassesScheduleTableView | ClassesScheduleMessageView
  >;
};
export type ClassesStoreChangeViewAction = {
  type: 'change-view';
  payload: ClassesStoreGroupActionPayload<'table' | 'message'>;
};
export type ClassesStoreChangePeriodAction = {
  type: 'change-period';
  payload: ClassesStoreGroupActionPayload<ClassesUpdatePeriod>;
};
export type ClassesStoreChangeMessageAction = {
  type: 'change-message';
  payload: ClassesStoreGroupActionPayload<string>;
};
export type ClassesStoreRemoveAction = {
  type: 'remove';
  payload: ClassesStoreGroupsActionPayload;
};
export type ClassesStoreAction =
  | ClassesStoreInitEmptyAction
  | ClassesStoreInitDefinedAction
  | ClassesStoreChangeViewAction
  | ClassesStoreChangePeriodAction
  | ClassesStoreChangeMessageAction
  | ClassesStoreRemoveAction;
