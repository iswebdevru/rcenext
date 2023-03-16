import {
  createSubject,
  deleteSubject,
  getSubject,
  getSubjects,
  SubjectCreate,
  subjectsKey,
  SubjectUpdate,
  updateSubject,
} from '@/shared/api';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

export function useSubjectCreate() {
  return useSWRMutation(subjectsKey, (_, { arg }: { arg: SubjectCreate }) =>
    createSubject(arg)
  );
}

export function useSubjects() {
  return useSWR(subjectsKey, getSubjects);
}

export function useSubject(id: number) {
  return useSWR([subjectsKey, id], ([_, id]) => getSubject(id));
}

export function useSubjectUpdate() {
  const { mutate } = useSWRConfig();
  return async (id: number, body: SubjectUpdate) => {
    return mutate(
      key =>
        key === subjectsKey ||
        (Array.isArray(key) && key[0] === subjectsKey && key[1] === id),
      () => updateSubject(id, body),
      {
        populateCache: false,
      }
    );
  };
}

export function useSubjectDeleteMany() {
  return useSWRMutation(subjectsKey, (_, { arg }: { arg: number[] }) =>
    Promise.all(arg.map(id => deleteSubject(id)))
  );
}
