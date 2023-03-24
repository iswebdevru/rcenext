export type Paginated<T> = {
  prev: null | string;
  next: null | string;
  results: T[];
};

export type Hyperlink = string;

export type Teacher = {
  url: Hyperlink;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: Hyperlink[];
  created_at: string;
  updated_at: string;
};

export type TeacherCreate = {
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: Hyperlink[];
};

export type TeacherUpdate = Partial<TeacherCreate>;

export type Subject = {
  url: Hyperlink;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SubjectCreate = {
  name: string;
};

export type SubjectUpdate = Partial<SubjectCreate>;

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

export type GroupCreate = {
  specialization: string;
  course: number;
  index: number;
  main_block: number;
  is_commercial: boolean;
};

export type GroupUpdate = Partial<GroupCreate>;

export type TimetablePeriod = {
  index: number;
  subject: Hyperlink;
  teachers: Hyperlink[];
  cabinet: string;
};

type CommonTimetableData = {
  url: Hyperlink;
  group: Hyperlink;
  periods: TimetablePeriod[];
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type MainTimetable = {
  is_main: true;
  week_type: string;
  week_day: string;
} & CommonTimetableData;

export type ChangesTimetable = {
  is_main: false;
  date: string;
} & CommonTimetableData;

export type MixedTimetable = MainTimetable | ChangesTimetable;
