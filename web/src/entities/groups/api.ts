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

export function useGroup(slug: string) {
  return useSWR([groupsKey, slug], ([_, id]) => getGroup(id));
}

export function useGroupUpdate() {
  const { mutate } = useSWRConfig();
  return async (slug: string, body: GroupUpdate) => {
    return mutate(
      key =>
        key === groupsKey ||
        (Array.isArray(key) && key[0] === groupsKey && key[1] === slug),
      () => updateGroup(slug, body),
      {
        populateCache: false,
      }
    );
  };
}

export function useGroupDeleteMany() {
  return useSWRMutation(groupsKey, (_, { arg }: { arg: string[] }) =>
    Promise.all(arg.map(slug => deleteGroup(slug)))
  );
}
