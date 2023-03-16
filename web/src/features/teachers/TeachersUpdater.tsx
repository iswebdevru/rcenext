import { useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useTeacher, useTeacherUpdate } from '@/entities/teachers';
import { TeachersTableRowPlaceholder } from './TeachersTableRowPlaceholder';
import { SelectSubjects } from './SelectSubjects';

export function TeachersUpdater({ id }: { id: number }) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);

  const { data: teacher } = useTeacher(id);
  const updateTeacher = useTeacherUpdate();

  if (!teacher) {
    return <TeachersTableRowPlaceholder />;
  }

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.patronymic : ''}
          ref={patronymicRef}
        />
      </Table.Data>
      <Table.Data>
        <SelectSubjects
          value={selectedSubjects}
          onChange={setSelectedSubjects}
          url={teacher.subjects_url}
        />
      </Table.Data>
      <Table.EditorActions
        onSave={() =>
          updateTeacher(id, {
            first_name: firstNameRef.current?.value,
            last_name: lastNameRef.current?.value,
            patronymic: patronymicRef.current?.value,
            subjects: selectedSubjects,
          })
        }
      />
    </Table.Row>
  );
}
