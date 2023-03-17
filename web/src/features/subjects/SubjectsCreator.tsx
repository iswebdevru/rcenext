import { useSubjectCreate } from '@/entities/subjects';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useRef } from 'react';

export function SubjectsCreator() {
  const nameRef = useRef<HTMLInputElement>(null);
  const { trigger: createSubject } = useSubjectCreate();

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} required />
      </Table.Data>
      <Table.EditorActions
        onSave={() => createSubject({ name: nameRef.current!.value })}
      />
    </Table.Row>
  );
}
