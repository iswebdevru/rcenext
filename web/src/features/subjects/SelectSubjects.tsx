import { API_SUBJECTS, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { MultipleSelectProps, Select } from '@/shared/ui/select';

export type SelectSubjectsProps = Pick<
  MultipleSelectProps<string>,
  'onChange' | 'value'
>;

export function SelectSubjects({ onChange, value }: SelectSubjectsProps) {
  const { data, lastElementRef } = usePaginatedFetch<Subject>(API_SUBJECTS);

  return (
    <Select<string> multiple value={value} onChange={onChange}>
      {data
        ?.map(page => page.results)
        .flat()
        .map((subject, i, a) => (
          <Select.Option
            ref={a.length === i + 1 ? lastElementRef : null}
            key={subject.url}
            value={subject.url}
          >
            {subject.name}
          </Select.Option>
        ))}
    </Select>
  );
}
