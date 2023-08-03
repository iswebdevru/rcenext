import { NextServerURLSearchParams } from '@/shared/packages/next';

export function getTeachersSearchParams(
  searchParams: NextServerURLSearchParams,
) {
  return new URLSearchParams({
    search: searchParams.search?.toString() ?? '',
  });
}
