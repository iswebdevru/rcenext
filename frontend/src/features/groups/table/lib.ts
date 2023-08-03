import { NextServerURLSearchParams } from '@/shared/packages/next';

export function getGroupsSearchParams(searchParams: NextServerURLSearchParams) {
  return new URLSearchParams({
    search: searchParams.search?.toString() ?? '',
  });
}
