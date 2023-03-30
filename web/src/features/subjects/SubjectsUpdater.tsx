import useSWR from 'swr';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';
import { SubjectsTableRowPlaceholder } from './SubjectsTableRowPlaceholder';
import { fetcher, Subject } from '@/shared/api';
import { getSession, signOut } from 'next-auth/react';

export function SubjectsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject } = useSWR<Subject>(url, fetcher);

  if (!subject) {
    return <SubjectsTableRowPlaceholder />;
  }

  const onSave = async () => {
    const session = await getSession();
    if (!session) {
      return;
    }
    await fetcher.patch(
      url,
      {
        body: {
          name: nameRef.current?.value,
        },
      },
      {
        token: session.accessToken.value,
        onUnauthorized: () => signOut({ callbackUrl: '/' }),
      }
    );

    return refresh();
  };

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} defaultValue={subject.name} />
      </Table.Data>
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
