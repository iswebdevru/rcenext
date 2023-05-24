export type Paginated<T> = {
  prev: null | string;
  next: null | string;
  results: T[];
};

export type Hyperlink = string;

export type Token = {
  token: string;
  expiry: string;
};

export type Teacher = {
  id: number;
  url: Hyperlink;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: Hyperlink[];
  created_at: string;
  updated_at: string;
};

export type Subject = {
  id: number;
  url: Hyperlink;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: number;
  url: Hyperlink;
  name: string;
  main_block: number;
  classes: Hyperlink;
  created_at: string;
  updated_at: string;
};

export type WeekType = 'ЧИСЛ' | 'ЗНАМ';
export type WeekDay = 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ' | 'СБ' | 'ВС';

export type ClassesSchedulePeriod = {
  index: number;
  subject: Hyperlink;
  teachers: Hyperlink[];
  cabinet: string;
};

type ClassesScheduleCommon = {
  id: number;
  url: Hyperlink;
  group: Hyperlink;
};

export type ClassesScheduleMain = {
  type: 'main';
  view: 'table';
  periods: ClassesSchedulePeriod[];
  week_day: WeekDay;
  week_type: WeekType;
} & ClassesScheduleCommon;

export type ClassesScheduleChangesTable = {
  type: 'changes';
  view: 'table';
  date: string;
  periods: ClassesSchedulePeriod[];
} & ClassesScheduleCommon;

export type ClassesScheduleChangesMessage = {
  type: 'changes';
  view: 'message';
  date: string;
  message: string;
} & ClassesScheduleCommon;

export type ClassesScheduleChanges =
  | ClassesScheduleChangesTable
  | ClassesScheduleChangesMessage;

export type ClassesScheduleMixed = ClassesScheduleMain | ClassesScheduleChanges;
