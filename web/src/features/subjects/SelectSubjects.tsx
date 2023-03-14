import { Select, SelectProps } from '@/shared/ui/select';
import { useSubjects } from '@/entities/subjects';

export function SelectSubjects({
  onChange,
  value,
}: Pick<SelectProps<number[]>, 'onChange' | 'value'>) {
  const { data } = useSubjects();

  return (
    <Select multiple value={value} onChange={onChange}>
      {data?.map(subject => (
        <Select.Option key={subject.id} value={subject.id}>
          {subject.name}
        </Select.Option>
      ))}
    </Select>
  );
}
