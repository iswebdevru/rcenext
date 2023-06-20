import useSWR from 'swr';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';
import { fetcher, partiallyUpdateEntity, Subject } from '@/shared/api';

export function SubjectsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject, mutate } = useSWR<Subject>(url, fetcher);

  if (!subject) {
    return null;
  }

  const onSave = () =>
    partiallyUpdateEntity(url, {
      body: {
        name: nameRef.current?.value,
      },
    });

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <InputText ref={nameRef} defaultValue={subject.name} />
      </Table.DataCell>
      <Table.DataCell>
        <Table.ButtonUpdate
          onSave={onSave}
          refresh={() => Promise.all([refresh(), mutate()])}
        />
        <Table.ButtonCancel />
      </Table.DataCell>
    </Table.Row>
  );
}
