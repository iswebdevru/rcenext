import useSWR from 'swr';
import { useRef, useState } from 'react';
import { API_SUBJECTS, Hyperlink, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { Select, SelectOption, useSelectTransition } from '@/shared/ui/Select';

export type SubjectSelect = {
  selectedSubjectURL: Hyperlink | null;
  onSelect: (subjectURL: Hyperlink | null) => void;
};

/**
 * Select 1 subject
 */
export function SubjectSelect({ selectedSubjectURL, onSelect }: SubjectSelect) {
  const [transitionState, toggleTransition] = useSelectTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchStr, setSearchStr] = useState('');
  const { data: pages, lastElementRef } = usePaginatedFetch<Subject>(
    transitionState.isMounted ? `${API_SUBJECTS}?search=${searchStr}` : null,
  );
  const { data: selectedSubject } = useSWR<Subject>(selectedSubjectURL);

  return (
    <Select<Hyperlink>
      onSelect={subjectUrl => {
        onSelect(selectedSubjectURL === subjectUrl ? null : subjectUrl);
        toggleTransition(false);
      }}
      transitionState={transitionState}
      onClose={() => toggleTransition(false)}
      inputElement={
        <>
          <input
            type="text"
            name="subject"
            value={searchStr}
            onChange={e => setSearchStr(e.target.value)}
            className="w-full bg-transparent px-1 py-0.5 text-sm"
            hidden={!transitionState.isMounted}
            ref={inputRef}
          />
          <button
            onClick={() => {
              toggleTransition(true);
              setTimeout(() => inputRef.current?.focus());
            }}
            hidden={transitionState.isMounted}
            className="w-full px-1 py-0.5 text-left text-sm"
          >
            {selectedSubject ? selectedSubject.name : '-------------'}
          </button>
        </>
      }
    >
      {pages
        ?.flatMap(page => page.results)
        .map((subject, i, a) => (
          <SelectOption
            key={subject.id}
            value={subject.url}
            selected={subject.url === selectedSubjectURL}
            ref={a.length - 1 === i ? lastElementRef : null}
          >
            {subject.name}
          </SelectOption>
        ))}
    </Select>
  );
}
