import { API_SUBJECTS, fetcher } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export function SubjectsCreator({ refresh }: TableCreatorComponentProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} required />
      </Table.Data>
      <Table.EditorActions
        onSave={async () => {
          await fetcher.post(API_SUBJECTS, { name: nameRef.current!.value });
          refresh();
        }}
      />
    </Table.Row>
  );
}
