import { getSubjects, subjectsKey } from '@/shared/api';
import useSWR from 'swr';

export function useSubjects() {
  return useSWR(subjectsKey, getSubjects);
}
