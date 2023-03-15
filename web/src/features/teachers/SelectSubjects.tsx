import { Select, SelectProps } from '@/shared/ui/select';
import { useSubjects } from '@/entities/subjects';
import { useEffect, useState } from 'react';
import { useTeacherSubjects } from '@/entities/teachers';

export type SelectSubjectsProps = {
  url?: string;
} & Pick<SelectProps<number[]>, 'onChange' | 'value'>;

export function SelectSubjects({ onChange, value, url }: SelectSubjectsProps) {
  const hasPreselectedSubjects = url !== undefined;
  const [werePreselectedSubjectsAdded, setWerePreselectedSubjectsAdded] =
    useState(false);
  const { data: allSubjects } = useSubjects();
  const { data: preselectedSubjects } = useTeacherSubjects(url);

  useEffect(() => {
    if (preselectedSubjects !== undefined && !werePreselectedSubjectsAdded) {
      onChange([...value, ...preselectedSubjects.map(subject => subject.id)]);
      setWerePreselectedSubjectsAdded(true);
    }
  }, [preselectedSubjects, onChange, value, werePreselectedSubjectsAdded]);

  return (
    <Select multiple value={value} onChange={onChange}>
      {hasPreselectedSubjects && preselectedSubjects === undefined
        ? undefined
        : allSubjects?.map(subject => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name}
            </Select.Option>
          ))}
    </Select>
  );
}
