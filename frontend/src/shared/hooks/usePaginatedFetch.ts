import { useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { Paginated } from '../api';
import { usePagination } from './usePagination';

export function usePaginatedFetch<T>(key: string | null) {
  const toNextFnRef = useRef(() => {});

  const { setSize, data, ...swrData } = useSWRInfinite<Paginated<T>>(
    (pageIndex, prevPageData) => {
      if (pageIndex === 0) {
        return key;
      }
      return prevPageData?.next;
    },
    {
      persistSize: true,
      keepPreviousData: true,
    },
  );
  toNextFnRef.current = () => setSize(p => p + 1);
  const lastElementRef = usePagination(toNextFnRef);

  return { ...swrData, data, lastElementRef };
}
