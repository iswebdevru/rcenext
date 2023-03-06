import useSWR from 'swr';

const API_HOST = 'http://localhost:8000';

const fetcher = <T>(...args: Parameters<typeof fetch>) =>
  fetch(...args).then<T>(res => res.json());

export type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string;
  subjects_url: string;
  created_at: string;
  updated_at: string;
};

export function useTeachers() {
  return useSWR<Teacher[]>(`${API_HOST}/teachers`, fetcher);
}
