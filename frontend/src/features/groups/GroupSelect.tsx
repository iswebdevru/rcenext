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

export function GroupSelect(props: GroupSelectProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const hide = () => setIsRevealed(false);

  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={hide}
      inputElement={
        <SearchField
          placeholder="Группа"
          onFocus={() => setIsRevealed(true)}
          value={props.groupSearch}
          onChange={e => props.onGroupSearchChange(e.currentTarget.value)}
        />
      }
    >
      {isRevealed ? <GroupSelectOptions {...props} hide={hide} /> : null}
    </SelectBeta>
  );
}

function GroupSelectOptions({
  groupSearchDebounced,
  groupSearch,
  onSelect,
  hide,
}: GroupSelectProps & { hide: () => void }) {
  const { data, lastElementRef } = usePaginatedFetch<Group>(
    `${API_GROUPS}?search=${groupSearchDebounced}`,
  );

  return (
    <>
      {data
        ?.flatMap(page => page.results)
        .map((group, i, arr) => (
          <SelectBetaOption
            key={group.id}
            ref={i === arr.length - 1 ? lastElementRef : null}
            selected={group.name === groupSearch}
            onSelect={() => {
              onSelect(group);
              hide();
            }}
          >
            {group.name}
          </SelectBetaOption>
        ))}
    </>
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
