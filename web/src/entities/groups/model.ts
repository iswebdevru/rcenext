import {
  createGroup,
  deleteGroup,
  getGroup,
  getGroups,
  GroupCreate,
  groupsKey,
  GroupUpdate,
  updateGroup,
} from '@/shared/api';
import useSWR, { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

export function useGroupCreate() {
  return useSWRMutation(groupsKey, (_, { arg }: { arg: GroupCreate }) =>
    createGroup(arg)
  );
}

export function useGroups() {
  return useSWR(groupsKey, getGroups);
}

export function useGroup(id: number) {
  return useSWR([groupsKey, id], ([_, id]) => getGroup(id));
}

export function useGroupUpdate() {
  const { mutate } = useSWRConfig();
  return async (id: number, body: GroupUpdate) => {
    return mutate(
      key =>
        key === groupsKey ||
        (Array.isArray(key) && key[0] === groupsKey && key[1] === id),
      () => updateGroup(id, body),
      {
        populateCache: false,
      }
    );
  };
}

export function useGroupDeleteMany() {
  return useSWRMutation(groupsKey, (_, { arg }: { arg: number[] }) =>
    Promise.all(arg.map(id => deleteGroup(id)))
  );
}
