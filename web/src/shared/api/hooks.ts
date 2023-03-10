import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation from 'swr/mutation';
import { API, Subject, Teacher, TeacherAdd, TeacherUpdate } from './contracts';
import { fetcher } from './fetch';

export function useTeachers() {
  return useSWR<Teacher[]>(`${API}/teachers/`, fetcher);
}

export function useTeacher(id?: number, config?: SWRConfiguration<Teacher>) {
  return useSWR(
    id ? [`${API}/teachers/`, id] : null,
    ([url, id]) => {
      return fetcher(`${url}${id}/`) as Promise<Teacher>;
    },
    config
  );
}

export function useTeacherCreate() {
  return useSWRMutation(
    `${API}/teachers/`,
    (url, { arg }: { arg: TeacherAdd }) => {
      return fetcher(url, {
        method: 'POST',
        body: JSON.stringify(arg),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;
    }
  );
}

export function useTeacherDelete() {
  return useSWRMutation(`${API}/teachers/`, (url, { arg }: { arg: number }) => {
    return fetch(`${url}${arg}/`, {
      method: 'DELETE',
    });
  });
}

export function useTeacherUpdate() {
  return useSWRMutation(
    `${API}/teachers/`,
    (url, { arg }: { arg: { id: number; body: TeacherUpdate } }) => {
      return fetcher(`${url}${arg.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(arg.body),
        headers: {
          'Content-Type': 'application/json',
        },
      }) as any;
    }
  );
}

export function useTeacherSubjects(url: string) {
  return useSWR<Subject[]>(url, fetcher);
}
