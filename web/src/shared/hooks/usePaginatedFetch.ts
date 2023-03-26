import { useCallback } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher, Paginated } from '../api';
import { usePagination } from './usePagination';

export function usePaginatedFetch<T>(url: string) {
  const { setSize, ...swrData } = useSWRInfinite<Paginated<T>>(
    (pageIndex, prevPageData) => {
      if (pageIndex === 0) {
        return url;
      }
      if (prevPageData?.next) {
        return prevPageData.next;
      }
      return null;
    },
    fetcher
  );
  const toNext = useCallback(() => setSize(p => p + 1), [setSize]);
  const lastElementRef = usePagination(toNext);
  return { ...swrData, setSize, lastElementRef };
}
