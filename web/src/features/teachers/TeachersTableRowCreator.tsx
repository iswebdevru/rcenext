import { useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useTeacherCreate } from '@/entities/teachers';
import { SelectSubjects } from '../subjects';

export function TeachersTableRowCreator() {
  const { trigger: createTeacher } = useTeacherCreate();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [subjects, setSubjects] = useState<number[]>([]);

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={firstNameRef} required />
      </Table.Data>
      <Table.Data>
        <InputText ref={lastNameRef} required />
      </Table.Data>
      <Table.Data>
        <InputText ref={patronymicRef} required />
      </Table.Data>
      <Table.Data>
        <SelectSubjects value={subjects} onChange={setSubjects} />
      </Table.Data>
      <Table.RowEditorActions
        onSave={() => {
          return createTeacher({
            first_name: firstNameRef.current!.value,
            last_name: lastNameRef.current!.value,
            patronymic: patronymicRef.current!.value,
            subjects: subjects,
          });
        }}
      />
    </Table.Row>
  );
}
