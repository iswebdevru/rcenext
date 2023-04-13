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
  url: Hyperlink;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: Hyperlink[];
  created_at: string;
  updated_at: string;
};

export type Subject = {
  url: Hyperlink;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Group = {
  url: Hyperlink;
  specialization: string;
  course: number;
  index: number;
  main_block: number;
  is_commercial: boolean;
  created_at: string;
  updated_at: string;
};

export type ClassesSchedulePeriod = {
  index: number;
  subject: Hyperlink;
  teachers: Hyperlink[];
  cabinet: string;
  note?: string;
};

type CommonTimetableData = {
  url: Hyperlink;
  group: Hyperlink;
  periods: ClassesSchedulePeriod[];
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type ClassesScheduleMain = {
  is_main: true;
  week_type: string;
  week_day: string;
} & CommonTimetableData;

export type ClassesScheduleChanges = {
  is_main: false;
  date: string;
} & CommonTimetableData;

export type ClassesScheduleMixed = ClassesScheduleMain | ClassesScheduleChanges;
