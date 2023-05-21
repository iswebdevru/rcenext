import { useRouter } from 'next/router';
import { useState } from 'react';
import { usePaginatedFetch } from '@/shared/hooks';
import { InputSearch } from '@/shared/ui/Input';
import { SelectBeta, SelectBetaOption } from '@/shared/ui/select';
import { API_GROUPS, Group } from '@/shared/api';
import { displayGroupName } from '@/entities/groups';

export function GroupSearch() {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(
    isRevealed ? API_GROUPS : null
  );

  const closeWindow = () => setIsRevealed(false);

  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={closeWindow}
      inputElement={
        <InputSearch
          placeholder="Группа"
          onFocus={() => setIsRevealed(true)}
          value={searchStr}
          onChange={e => setSearchStr(e.target.value)}
        />
      }
    >
      {groups
        ?.map(page => page.results)
        .flat()
        .map((group, i, arr) => (
          <SelectBetaOption
            key={group.url}
            ref={i === arr.length - 1 ? lastElementRef : null}
            selected={false}
            onSelect={() => {
              closeWindow();
              router.push('/classes');
            }}
          >
            {displayGroupName(group)}
          </SelectBetaOption>
        ))}
    </SelectBeta>
  );
}
