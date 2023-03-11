import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { API, Subject, TeacherAdd, TeacherUpdate } from './contracts';
import { fetcher } from './fetch';
import {
  getTeachers,
  getTeacher,
  deleteTeacher,
  createTeacher,
} from './requests';

export function useTeachers() {
  return useSWR(`api/teachers/`, getTeachers);
}

export function useTeacher(id: number) {
  return useSWR(['api/teachers/', id], ([_, id]) => getTeacher(id));
}

export function useTeacherCreate() {
  return useSWRMutation(`api/teachers/`, (_, { arg }: { arg: TeacherAdd }) =>
    createTeacher(arg)
  );
}

export function useTeacherDelete(id: number) {
  return useSWRMutation('api/teachers/', () => deleteTeacher(id));
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
