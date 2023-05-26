import useSWR from 'swr';
import { useRef, useState } from 'react';
import { API_SUBJECTS, Hyperlink, Subject, fetcher } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { SelectBeta, SelectBetaOption } from '@/shared/ui/select';

export type SubjectSelect = {
  selectedSubjectURL: Hyperlink | null;
  onSelect: (subjectURL: Hyperlink | null) => void;
};

/**
 * Select 1 subject
 */
export function SubjectSelect({ selectedSubjectURL, onSelect }: SubjectSelect) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const { data: pages, lastElementRef } = usePaginatedFetch<Subject>(
    isRevealed ? `${API_SUBJECTS}?search=${searchStr}` : null
  );
  const { data: selectedSubject } = useSWR<Subject>(
    selectedSubjectURL,
    fetcher
  );

  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={() => setIsRevealed(false)}
      inputElement={
        <>
          <input
            type="text"
            value={searchStr}
            onChange={e => setSearchStr(e.target.value)}
            className="w-full px-1 py-0.5 text-sm bg-transparent"
            hidden={!isRevealed}
            ref={inputRef}
          />
          <button
            onClick={() => {
              setIsRevealed(true);
              setTimeout(() => inputRef.current?.focus());
            }}
            hidden={isRevealed}
            className="w-full text-left text-sm px-1 py-0.5"
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
              setIsRevealed(false);
            }}
            ref={a.length - 1 === i ? lastElementRef : null}
          >
            {subject.name}
          </SelectBetaOption>
        ))}
    </SelectBeta>
  );
}
