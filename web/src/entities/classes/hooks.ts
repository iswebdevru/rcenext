import { usePaginatedFetch } from '@/shared/hooks';
import { ClassesScheduleUrlConfig } from './api';
import { createClassesScheduleUrl } from './api';
import { ClassesScheduleMixed } from '@/shared/api';

export type ClassesScheduleQuery = ClassesScheduleUrlConfig & {
  abort?: boolean;
};

export function useClassesSchedule(options: ClassesScheduleQuery) {
  return usePaginatedFetch<ClassesScheduleMixed>(
    options.abort ? null : createClassesScheduleUrl(options)
  );
}
