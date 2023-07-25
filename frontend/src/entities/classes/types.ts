import { ClassesScheduleMixed, Hyperlink } from '@/shared/api';

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
  url?: Hyperlink;
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
export type ClassesStoreGroupActionBasePayload = {
  group: Hyperlink;
};
export type ClassesStoreGroupsActionBasePayload = {
  groups: Hyperlink[];
};
export type ClassesStoreGroupActionPayload<T> = {
  data: T;
} & ClassesStoreGroupActionBasePayload;
export type ClassesStoreGroupsActionPayload<T> = {
  data: T;
} & ClassesStoreGroupsActionBasePayload;

export type ClassesStoreInitEmptyAction = {
  type: 'init-empty';
  payload: ClassesStoreGroupActionBasePayload;
};
export type ClassesStoreInitDefinedAction = {
  type: 'init-defined';
  payload: ClassesStoreGroupActionPayload<ClassesScheduleMixed>;
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
  payload: ClassesStoreGroupsActionBasePayload;
};
export type ClassesStoreCloneResetAction = {
  type: 'reset';
  payload: ClassesStoreGroupActionBasePayload;
};
export type ClassesStoreAction =
  | ClassesStoreInitEmptyAction
  | ClassesStoreInitDefinedAction
  | ClassesStoreChangeViewAction
  | ClassesStoreChangePeriodAction
  | ClassesStoreChangeMessageAction
  | ClassesStoreRemoveAction
  | ClassesStoreCloneResetAction;
