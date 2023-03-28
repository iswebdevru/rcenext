import { API_SUBJECTS, fetcher, formatToken } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { getSession } from 'next-auth/react';
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
          const session = await getSession();
          if (!session) {
            return;
          }
          await fetcher.post(
            API_SUBJECTS,
            { name: nameRef.current!.value },
            formatToken(session)
          );
          return refresh();
        }}
      />
    </Table.Row>
  );
}
