import useSWR, { SWRConfiguration } from 'swr';

const API = 'http://localhost:8000';

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
  return useSWR<Teacher[]>(`${API}/teachers/`, fetcher);
}

export function useTeacher(id?: number, config?: SWRConfiguration<Teacher>) {
  return useSWR(
    id ? [`${API}/teachers`, id] : null,
    ([url, id]) => {
      return fetcher(`${url}/${id}/`) as Promise<Teacher>;
    },
    config
  );
}
