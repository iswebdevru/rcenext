import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { SearchField } from '@/shared/ui/controls';
import {
  SelectBeta,
  SelectBetaOption,
  useSelectTransition,
} from '@/shared/ui/select';
import { API_GROUPS, Group } from '@/shared/api';

export type GroupSelectProps = {
  onSelect: (group: Group) => void;
  groupSearch: string;
  onGroupSearchChange: (groupSearch: string) => void;
};

export function GroupSelect({
  onSelect,
  groupSearch,
  onGroupSearchChange,
}: GroupSelectProps) {
  const [transitionState, toggleTransition] = useSelectTransition();

  const groupSearchDebounced = useDebounce(groupSearch);

  const { data, lastElementRef } = usePaginatedFetch<Group>(
    transitionState.isMounted
      ? `${API_GROUPS}?search=${groupSearchDebounced}`
      : null,
  );

  return (
    <SelectBeta
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <SearchField
          name="group"
          autoComplete="off"
          placeholder="Группа"
          onFocus={() => toggleTransition(true)}
          value={groupSearch}
          onChange={e => onGroupSearchChange(e.currentTarget.value)}
        />
      }
    >
      {data
        ?.flatMap(page => page.results)
        .map((group, i, arr) => (
          <SelectBetaOption
            key={group.id}
            ref={i === arr.length - 1 ? lastElementRef : null}
            selected={group.name === groupSearch}
            onSelect={() => {
              onSelect(group);
              toggleTransition(false);
            }}
          >
            {group.name}
          </SelectBetaOption>
        ))}
    </SelectBeta>
  );
}

export function GroupSearch() {
  const router = useRouter();
  const [groupSearch, setGroupSearch] = useState('');

  return (
    <GroupSelect
      groupSearch={groupSearch}
      onGroupSearchChange={setGroupSearch}
      onSelect={() => router.push('/')}
    />
  );
}
