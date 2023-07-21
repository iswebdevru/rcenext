import { Hyperlink, Teacher } from '../contracts';
import { API_TEACHERS } from '../urls';
import { crud } from './crud';

export type TeacherBody = Omit<
  Teacher,
  'id' | 'url' | 'created_at' | 'updated_at'
>;

export const apiTeachers = {
  async create(body: TeacherBody) {
    return crud.post(API_TEACHERS, body) as Promise<Teacher>;
  },
  async delete(url: Hyperlink) {
    return crud.delete(url);
  },
  async edit(url: Hyperlink, body: Partial<TeacherBody>) {
    return crud.patch(url, body) as Promise<Teacher>;
  },
};
