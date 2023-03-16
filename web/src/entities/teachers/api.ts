import {
  createTeacher,
  deleteTeacher,
  fetcher,
  getTeacher,
  getTeachers,
  Subject,
  TeacherCreate,
  teachersKey,
  TeacherUpdate,
  updateTeacher,
} from '@/shared/api';
import useSWRMutation from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';

export function useTeacherCreate() {
  return useSWRMutation(teachersKey, (_, { arg }: { arg: TeacherCreate }) =>
    createTeacher(arg)
  );
}

export function useTeachers() {
  return useSWR(teachersKey, getTeachers);
}

export function useTeacher(id: number) {
  return useSWR([teachersKey, id], ([_, id]) => getTeacher(id));
}

export function useTeacherUpdate() {
  const { mutate } = useSWRConfig();
  return async (id: number, payload: TeacherUpdate) => {
    return mutate(
      key => {
        return (
          key === teachersKey ||
          (Array.isArray(key) && key[0] === teachersKey && key[1] === id)
        );
      },
      () => updateTeacher(id, payload),
      {
        populateCache: false,
      }
    );
  };
}

export function useTeacherDeleteMany() {
  return useSWRMutation(teachersKey, async (_, { arg }: { arg: number[] }) => {
    return Promise.all(arg.map(id => deleteTeacher(id)));
  });
}

export function useTeacherSubjects(url?: string) {
  return useSWR<Subject[]>(url, fetcher);
}
