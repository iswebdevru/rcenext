import { API_SUBJECTS, Hyperlink, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import {
  SelectBeta,
  SelectBetaOption,
  useSelectTransition,
} from '@/shared/ui/select';
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
    <SelectBeta
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
          <SelectBetaOption
            ref={a.length === i + 1 ? lastElementRef : null}
            key={subject.url}
            selected={selectedSubjects.has(subject.url)}
            onSelect={() => {
              onChange(prev => {
                const clone = new Set(prev);
                if (clone.has(subject.url)) {
                  clone.delete(subject.url);
                } else {
                  clone.add(subject.url);
                }
                return clone;
              });
            }}
          >
            {subject.name}
          </SelectBetaOption>
        ))}
    </SelectBeta>
  );
}
