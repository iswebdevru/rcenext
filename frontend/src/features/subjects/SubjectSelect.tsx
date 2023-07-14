import useSWR from 'swr';
import { useRef, useState } from 'react';
import { API_SUBJECTS, Hyperlink, Subject, fetcher } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import {
  SelectBeta,
  SelectBetaOption,
  useSelectTransition,
} from '@/shared/ui/select';

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
  const { data: selectedSubject } = useSWR<Subject>(
    selectedSubjectURL,
    fetcher,
  );

  return (
    <SelectBeta
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
          <SelectBetaOption
            key={subject.id}
            selected={subject.url === selectedSubjectURL}
            onSelect={() => {
              onSelect(selectedSubjectURL === subject.url ? null : subject.url);
              toggleTransition(false);
            }}
            ref={a.length - 1 === i ? lastElementRef : null}
          >
            {subject.name}
          </SelectBetaOption>
        ))}
    </SelectBeta>
  );
}
