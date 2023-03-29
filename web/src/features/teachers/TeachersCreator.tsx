import { useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { SelectSubjects } from '../subjects/SelectSubjects';
import { API_TEACHERS, fetcher } from '@/shared/api';
import { getSession, signOut } from 'next-auth/react';

export function TeachersCreator({ refresh }: TableCreatorComponentProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  const onSave = async () => {
    const session = await getSession();
    if (!session) {
      return;
    }
    await fetcher.post(API_TEACHERS, {
      body: {
        first_name: firstNameRef.current!.value,
        last_name: lastNameRef.current!.value,
        patronymic: patronymicRef.current!.value,
        subjects: subjects,
      },
      token: session.accessToken.value,
      onUnauthorized: () => signOut({ callbackUrl: '/' }),
    });
    refresh();
  };

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
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
