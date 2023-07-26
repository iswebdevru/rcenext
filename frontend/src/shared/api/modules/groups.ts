import { Group, Hyperlink } from '../contracts';
import { API_GROUPS } from '../urls';
import { crud } from './crud';

export type GroupBody = Omit<
  Group,
  'id' | 'url' | 'created_at' | 'updated_at' | 'classes'
>;

export const apiGroups = {
  async create(body: GroupBody) {
    return crud.post(API_GROUPS, body) as Promise<Group>;
  },
  async delete(url: Hyperlink) {
    return crud.delete(url);
  },
  async edit(url: Hyperlink, body: Partial<GroupBody>) {
    return crud.patch(url, body) as Promise<Group>;
  },
};
