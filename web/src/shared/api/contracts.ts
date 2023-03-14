export type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects_url: string;
  created_at: string;
  updated_at: string;
};

export type TeacherAdd = {
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects: number[];
};

export type TeacherUpdate = Partial<TeacherAdd>;

export type Subject = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};
