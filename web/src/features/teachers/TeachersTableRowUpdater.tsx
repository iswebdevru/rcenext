import { useRef } from 'react';
import { InputText } from '@/shared/ui/input';
import { Table } from '@/shared/ui/Table';
import { TeachersTableRowPlaceholder } from './TeachersTableRowPlaceholder';
import { useTeacher, useTeacherUpdate } from '@/entities/teachers';

export function TeachersTableRowUpdater({ id }: { id: number }) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);

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
      <Table.Data></Table.Data>
      <Table.RowEditorActions
        onSave={() =>
          updateTeacher(id, {
            first_name: firstNameRef.current?.value,
            last_name: lastNameRef.current?.value,
            patronymic: patronymicRef.current?.value,
          })
        }
      />
    </Table.Row>
  );
}
