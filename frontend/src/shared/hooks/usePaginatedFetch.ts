import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher, Paginated } from '../api';
import { usePagination } from './usePagination';

export function usePaginatedFetch<T>(key: string | null) {
  const { setSize, ...swrData } = useSWRInfinite<Paginated<T>>(
    (pageIndex, prevPageData) => {
      if (key === null) {
        return null;
      }
      if (pageIndex === 0) {
        return key;
      }
      if (prevPageData?.next) {
        return prevPageData.next;
      }
      return null;
    },
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const toNext = useCallback(() => setSize(p => p + 1), [setSize]);
  const lastElementRef = usePagination(toNext);
  return { ...swrData, setSize, lastElementRef };
}
