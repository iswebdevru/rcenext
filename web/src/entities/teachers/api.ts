import {
  createTeacher,
  deleteTeacher,
  fetcher,
  getTeacher,
  getTeachers,
  Subject,
  TeacherAdd,
  teachersKey,
  TeacherUpdate,
  updateTeacher,
} from '@/shared/api';
import useSWRMutation from 'swr/mutation';
import useSWR, { useSWRConfig } from 'swr';

export function useTeacherDeleteMany() {
  return useSWRMutation(teachersKey, async (_, { arg }: { arg: number[] }) => {
    return Promise.all(arg.map(id => deleteTeacher(id)));
  });
}

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

export function useTeacherSubjects(url?: string) {
  return useSWR<Subject[]>(url, fetcher);
}
