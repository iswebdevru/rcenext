import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { Subject, TeacherAdd, TeacherUpdate } from './contracts';
import { fetcher } from './fetch';
import {
  getTeachers,
  getTeacher,
  deleteTeacher,
  createTeacher,
  updateTeacher,
} from './requests';

export const teachersKey = 'api/teachers/';

export function useTeachers() {
  return useSWR(teachersKey, getTeachers);
}

export function useTeacher(id: number) {
  return useSWR([teachersKey, id], ([_, id]) => getTeacher(id));
}

export function useTeacherCreate() {
  return useSWRMutation(teachersKey, (_, { arg }: { arg: TeacherAdd }) =>
    createTeacher(arg)
  );
}

export function useTeacherDelete() {
  return useSWRMutation(teachersKey, (_, { arg }: { arg: number }) =>
    deleteTeacher(arg)
  );
}

export function useTeacherUpdate() {
  const { mutate } = useSWRConfig();
  return async (id: number, payload: TeacherUpdate) => {
    return mutate(
      key => {
        return (
          key === teachersKey ||
          (Array.isArray(key) && `${key[0]}${key[1]}` === `${teachersKey}${id}`)
        );
      },
      () => updateTeacher(id, payload),
      {
        populateCache: false,
      }
    );
  };
}

export function useTeacherSubjects(url: string) {
  return useSWR<Subject[]>(url, fetcher);
}
