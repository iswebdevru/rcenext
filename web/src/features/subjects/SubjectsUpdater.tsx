import useSWR from 'swr';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';
import { SubjectsTableRowPlaceholder } from './SubjectsTableRowPlaceholder';
import { fetcher, formatToken, Subject } from '@/shared/api';
import { getSession } from 'next-auth/react';

export function SubjectsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject } = useSWR<Subject>(url, fetcher);

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
        onSave={async () => {
          const session = await getSession();
          if (!session) {
            return;
          }
          await fetcher.patch(
            url,
            {
              name: nameRef.current?.value,
            },
            formatToken(session)
          );
          return refresh();
        }}
      />
    </Table.Row>
  );
}
