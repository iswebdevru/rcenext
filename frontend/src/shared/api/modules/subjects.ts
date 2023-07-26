import { Hyperlink, Subject } from '../contracts';
import { API_SUBJECTS } from '../urls';
import { crud } from './crud';

export type SubjectBody = Omit<
  Subject,
  'id' | 'url' | 'created_at' | 'updated_at'
>;

export const apiSubjects = {
  async create(body: SubjectBody) {
    return crud.post(API_SUBJECTS, body) as Promise<Subject>;
  },
  async delete(url: Hyperlink) {
    return crud.delete(url);
  },
  async edit(url: Hyperlink, body: Partial<SubjectBody>) {
    return crud.patch(url, body) as Promise<Subject>;
  },
};
