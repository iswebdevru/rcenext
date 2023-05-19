import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useClickOutside, usePaginatedFetch } from '@/shared/hooks';
import { InputSearch } from '@/shared/ui/Input';
import {
  SelectBeta,
  SelectBetaOption,
  SelectBetaOptions,
} from '@/shared/ui/select';
import { API_GROUPS, Group } from '@/shared/api';
import { displayGroupName } from '@/entities/groups';

export function GroupSearch() {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);

  useClickOutside(componentRef, () => setIsRevealed(false));

  return (
    <SelectBeta ref={componentRef}>
      <InputSearch
        placeholder="Группа"
        onFocus={() => setIsRevealed(true)}
        value={searchStr}
        onChange={e => setSearchStr(e.target.value)}
      />
      <SelectBetaOptions isRevealed={isRevealed}>
        {groups
          ?.map(page => page.results)
          .flat()
          .map((group, i, arr) => (
            <SelectBetaOption
              key={group.url}
              ref={i === arr.length - 1 ? lastElementRef : null}
              selected={false}
              onSelect={() => {
                setIsRevealed(false);
                router.push('/classes');
              }}
            >
              {displayGroupName(group)}
            </SelectBetaOption>
          ))}
      </SelectBetaOptions>
    </SelectBeta>
  );
}
