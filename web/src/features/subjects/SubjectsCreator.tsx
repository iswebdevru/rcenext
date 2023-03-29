import { API_SUBJECTS, fetcher } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { getSession, signOut } from 'next-auth/react';
import { useRef } from 'react';

export function SubjectsCreator({ refresh }: TableCreatorComponentProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  const onSave = async () => {
    const session = await getSession();
    if (!session) {
      return;
    }
    await fetcher.post(API_SUBJECTS, {
      body: { name: nameRef.current!.value },
      token: session.accessToken.value,
      onUnauthorized: () => signOut({ callbackUrl: '/' }),
    });
    return refresh();
  };

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} required />
      </Table.Data>
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
