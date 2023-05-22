import { ChangeEventHandler, useState } from 'react';
import { usePaginatedFetch } from '@/shared/hooks';
import { InputSearch } from '@/shared/ui/Input';
import { SelectBeta, SelectBetaOption } from '@/shared/ui/select';
import { API_GROUPS, Group } from '@/shared/api';

export type GroupSelectProps = {
  onSelect: (group: Group) => void;
  searchStr: string;
  onSearchStrChange: ChangeEventHandler<HTMLInputElement>;
};

export function GroupSelect({
  searchStr,
  onSearchStrChange,
  onSelect,
}: GroupSelectProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(
    isRevealed ? `${API_GROUPS}?search=${searchStr}` : null
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
          onChange={onSearchStrChange}
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
            selected={group.name === searchStr}
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
