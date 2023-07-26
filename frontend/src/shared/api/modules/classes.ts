import { ClassesScheduleMixed, Hyperlink } from '../contracts';
import { API_CLASSES } from '../urls';
import { crud } from './crud';

export type ClassesBody = Omit<
  ClassesScheduleMixed,
  'id' | 'url' | 'created_at' | 'updated_at'
>;

export const apiClasses = {
  async create(body: ClassesBody) {
    return crud.post(API_CLASSES, body) as Promise<ClassesScheduleMixed>;
  },
  async delete(url: Hyperlink) {
    return crud.delete(url);
  },
  async edit(url: Hyperlink, body: Partial<ClassesBody>) {
    return crud.patch(url, body) as Promise<ClassesScheduleMixed>;
  },
};
