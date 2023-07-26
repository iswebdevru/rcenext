import { BellsMixed, Hyperlink } from '../contracts';
import { API_BELLS } from '../urls';
import { crud } from './crud';

export type BellsBody = Omit<BellsMixed, 'id' | 'url'>;

export const apiBells = {
  async create(body: BellsBody) {
    return crud.post(API_BELLS, body) as Promise<BellsMixed>;
  },
  async delete(url: Hyperlink) {
    return crud.delete(url);
  },
  async edit(url: Hyperlink, body: Partial<BellsBody>) {
    return crud.patch(url, body) as Promise<BellsMixed>;
  },
};
