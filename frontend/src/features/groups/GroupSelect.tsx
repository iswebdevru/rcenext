import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { SearchField } from '@/shared/ui/Controls';
import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';
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
    <Select<Group>
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      onSelect={group => {
        onSelect(group);
        toggleTransition(false);
      }}
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
          <SelectOption
            key={group.id}
            ref={i === arr.length - 1 ? lastElementRef : null}
            selected={group.name === groupSearch}
            value={group}
          >
            {group.name}
          </SelectOption>
        ))}
    </Select>
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
