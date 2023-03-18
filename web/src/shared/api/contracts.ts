export type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects_url: string;
  created_at: string;
  updated_at: string;
};

export type TeacherCreate = {
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: number[];
};

export type TeacherUpdate = Partial<TeacherCreate>;

export type Subject = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export type SubjectCreate = {
  name: string;
};

export type SubjectUpdate = Partial<SubjectCreate>;

export type Group = {
  id: number;
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
