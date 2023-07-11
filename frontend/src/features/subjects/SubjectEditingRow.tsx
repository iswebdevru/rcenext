import { useRef } from 'react';
import useSWR from 'swr';
import { TextField } from '@/shared/ui/controls';
import { Table } from '@/shared/ui/Table';
import { fetcher, partiallyUpdateEntity, Subject } from '@/shared/api';

export type SubjectEditingRowProps = {
  id: string;
  refresh: () => Promise<unknown>;
};

export function SubjectEditingRow({
  id: url,
  refresh,
}: SubjectEditingRowProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject, mutate } = useSWR<Subject>(url, fetcher);

  if (!subject) {
    return null;
  }

  const onSave = async () => {
    await partiallyUpdateEntity(url, {
      body: {
        name: nameRef.current?.value,
      },
    });
    return Promise.all([refresh(), mutate()]);
  };

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <TextField ref={nameRef} defaultValue={subject.name} />
      </Table.DataCell>
      <Table.DataCell>
        <Table.ButtonUpdate onSave={onSave} />
        <Table.ButtonCancel />
      </Table.DataCell>
    </Table.Row>
  );
}
