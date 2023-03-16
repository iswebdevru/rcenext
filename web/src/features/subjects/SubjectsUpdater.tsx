import { useSubject, useSubjectUpdate } from '@/entities/subjects';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useRef } from 'react';
import { SubjectsTableRowPlaceholder } from './SubjectsTableRowPlaceholder';

export function SubjectsUpdater({ id }: { id: number }) {
  const nameRef = useRef<HTMLInputElement>(null);

  const { data: subject } = useSubject(id);
  const updateSubject = useSubjectUpdate();

  if (!subject) {
    return <SubjectsTableRowPlaceholder />;
  }

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} defaultValue={subject.name} />
      </Table.Data>
      <Table.EditorActions
        onSave={() =>
          updateSubject(id, {
            name: nameRef.current?.value,
          })
        }
      />
    </Table.Row>
  );
}
