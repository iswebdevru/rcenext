import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { SearchField } from '@/shared/ui/controls';
import { SelectBeta, SelectBetaOption } from '@/shared/ui/select';
import { API_GROUPS, Group } from '@/shared/api';

export type GroupSelectProps = {
  onSelect: (group: Group) => void;
  groupSearch: string;
  groupSearchDebounced: string;
  onGroupSearchChange: (groupSearch: string) => void;
};

export function GroupSelect({
  groupSearch,
  groupSearchDebounced,
  onGroupSearchChange,
  onSelect,
}: GroupSelectProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { data, lastElementRef } = usePaginatedFetch<Group>(
    isRevealed ? `${API_GROUPS}?search=${groupSearchDebounced}` : null
  );

  const closeWindow = () => setIsRevealed(false);

  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={closeWindow}
      inputElement={
        <SearchField
          placeholder="Группа"
          onFocus={() => setIsRevealed(true)}
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
              closeWindow();
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
  const groupSearchDebounced = useDebounce(groupSearch);
  return (
    <GroupSelect
      groupSearch={groupSearch}
      groupSearchDebounced={groupSearchDebounced}
      onGroupSearchChange={setGroupSearch}
      onSelect={() => router.push('/')}
    />
  );
}
