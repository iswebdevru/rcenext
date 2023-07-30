import { SWRInfiniteKeyLoader } from 'swr/infinite';
import { Paginated } from '@/shared/api';

export function createInfiniteKey<
  Data extends Paginated<unknown> = Paginated<unknown>,
>(initKey: string | null): SWRInfiniteKeyLoader<Data> {
  return (index, prevPage) => {
    if (index === 0) {
      return initKey;
    }
    return prevPage?.next;
  };
}
