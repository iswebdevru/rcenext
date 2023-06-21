import { API_SUBJECTS, createEntity } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export function SubjectsCreator({ refresh }: TableCreatorComponentProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  const onSave = () =>
    createEntity(API_SUBJECTS, {
      body: { name: nameRef.current!.value },
    });

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <InputText ref={nameRef} required />
      </Table.DataCell>
    </Table.Row>
  );
}
