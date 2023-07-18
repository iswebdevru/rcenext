import { API_SUBJECTS, Hyperlink, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';
import { Dispatch, SetStateAction } from 'react';

export type SelectSubjectsProps = {
  selectedSubjects: Set<Hyperlink>;
  onChange: Dispatch<SetStateAction<Set<Hyperlink>>>;
};

export function SelectSubjects({
  onChange,
  selectedSubjects,
}: SelectSubjectsProps) {
  const [transitionState, toggleTransition] = useSelectTransition();

  const { data, lastElementRef } = usePaginatedFetch<Subject>(API_SUBJECTS);

  return (
    <Select<Hyperlink>
      onSelect={subject => {
        onChange(prev => {
          const clone = new Set(prev);
          if (clone.has(subject)) {
            clone.delete(subject);
          } else {
            clone.add(subject);
          }
          return clone;
        });
      }}
      inputElement={
        <button type="button" onClick={() => toggleTransition()}>
          select
        </button>
      }
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
    >
      {data
        ?.flatMap(page => page.results)
        .map((subject, i, a) => (
          <SelectOption
            ref={a.length === i + 1 ? lastElementRef : null}
            key={subject.url}
            selected={selectedSubjects.has(subject.url)}
            value={subject.url}
          >
            {subject.name}
          </SelectOption>
        ))}
    </Select>
  );
}
