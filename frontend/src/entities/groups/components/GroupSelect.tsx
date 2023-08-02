import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '@/shared/hooks';
import { SearchField } from '@/shared/ui/Controls';
import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';
import { API_GROUPS, Group, Paginated } from '@/shared/api';
import { createInfiniteKey } from '@/shared/packages/swr';
import { InfiniteScroll } from '@/shared/ui/InfiniteScroll';

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

  const { data, setSize } = useSWRInfinite<Paginated<Group>>(createInfiniteKey(`${API_GROUPS}?search=${groupSearchDebounced}`));

  const isEnd = !data || !data.at(-1)?.next

  return (
    <Select<Group>
      noWrapWithUl
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
      <InfiniteScroll wrapper="ul" trigger="li" ignore={isEnd} onLoad={() => setSize(p => p + 1)}>
        {data
          ?.flatMap(page => page.results)
          .map(group => (
            <SelectOption
              key={group.id}
              selected={group.name === groupSearch}
              value={group}
            >
              {group.name}
            </SelectOption>
          ))}
      </InfiniteScroll>
    </Select>
  );
}