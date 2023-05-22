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
  note?: string;
};

type CommonTimetableData = {
  id: number;
  url: Hyperlink;
  group: Hyperlink;
  periods: ClassesSchedulePeriod[];
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type ClassesScheduleMain = {
  is_main: true;
  week_type: WeekType;
  week_day: WeekDay;
} & CommonTimetableData;

export type ClassesScheduleChanges = {
  is_main: false;
  date: string;
} & CommonTimetableData;

export type ClassesScheduleMixed = ClassesScheduleMain | ClassesScheduleChanges;
