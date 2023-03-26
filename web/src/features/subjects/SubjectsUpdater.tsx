import useSWR from 'swr';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';
import { SubjectsTableRowPlaceholder } from './SubjectsTableRowPlaceholder';
import { fetcher } from '@/shared/api';

export function SubjectsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject } = useSWR(url);

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
          await fetcher.patch(url, {
            name: nameRef.current?.value,
          });
          refresh();
        }}
      />
    </Table.Row>
  );
}
