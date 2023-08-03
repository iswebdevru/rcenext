import { NextServerURLSearchParams } from '@/shared/packages/next';

export function getSubjectsSearchParams(
  searchParams: NextServerURLSearchParams,
) {
  return new URLSearchParams({
    search: searchParams.search?.toString() ?? '',
  });
}
