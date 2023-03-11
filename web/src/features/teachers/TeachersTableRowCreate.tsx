import { useRef } from 'react';
import { useTeacherCreate } from '@/shared/api';
import { InputText } from '@/shared/ui/input';
import { Table } from '@/shared/ui/Table';

export function TeachersTableRowCreate() {
  const { trigger: createTeacher } = useTeacherCreate();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);

  return (
    <Table.RowCreate
      onCreate={() => {
        return createTeacher({
          first_name: firstNameRef.current!.value,
          last_name: lastNameRef.current!.value,
          patronymic: patronymicRef.current!.value,
          subjects: [],
        });
      }}
    >
      <Table.Data>
        <InputText ref={firstNameRef} required />
      </Table.Data>
      <Table.Data>
        <InputText ref={lastNameRef} required />
      </Table.Data>
      <Table.Data>
        <InputText ref={patronymicRef} required />
      </Table.Data>
      <Table.Data></Table.Data>
    </Table.RowCreate>
  );
}

// type SelectSubjectProps = {
//   url?: string;
//   selectedSubjects: number[];
//   onChange: (ids: number[]) => void;
// };

// function SelectSubject({
//   url,
//   selectedSubjects,
//   onChange,
// }: SelectSubjectProps) {
//   return (
//     <Select value={1} onChange={v => {}}>
//       <Select.Option value={1}>a</Select.Option>
//       <Select.Option value={2}>a</Select.Option>
//       <Select.Option value={3}>a</Select.Option>
//     </Select>
//   );
// }
