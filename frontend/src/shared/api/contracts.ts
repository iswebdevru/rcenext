export type Paginated<T> = {
  prev: null | string;
  next: null | string;
  results: T[];
};

export type ErrorsMap = Record<string, string[]>;

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

export type ClassesScheduleTableView = {
  view: 'table';
  periods: ClassesSchedulePeriod[];
};

export type ClassesScheduleMessageView = {
  view: 'message';
  message: string;
};

export type ClassesScheduleMain = {
  type: 'main';
  week_day: WeekDay;
  week_type: WeekType;
} & (ClassesScheduleTableView | ClassesScheduleMessageView) &
  ClassesScheduleCommon;

export type ClassesScheduleChanges = {
  type: 'changes';
  date: string;
} & (ClassesScheduleTableView | ClassesScheduleMessageView) &
  ClassesScheduleCommon;

export type ClassesScheduleMixed = ClassesScheduleMain | ClassesScheduleChanges;

type BellsPeriodCommon = {
  index: number;
  period_from: string;
  period_to: string;
};

export type BellsPeriodWithBreak = BellsPeriodCommon & {
  has_break: true;
  period_from_after: string;
  period_to_after: string;
};

export type BellsPeriodWithoutBreak = BellsPeriodCommon & { has_break: false };

export type BellsPeriod = BellsPeriodWithBreak | BellsPeriodWithoutBreak;

type BellsCommon = {
  id: number;
  url: Hyperlink;
  variant: 'normal' | 'reduced';
  periods: BellsPeriod[];
};

export type BellsMain = BellsCommon & {
  type: 'main';
  week_day: WeekDay;
};

export type BellsChanges = BellsCommon & {
  type: 'changes';
  date: string;
};

export type BellsMixed = BellsMain | BellsChanges;
