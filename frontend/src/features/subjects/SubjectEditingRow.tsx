import { useRef } from 'react';
import useSWR from 'swr';
import { TextField } from '@/shared/ui/Controls';
import { Table } from '@/shared/ui/Table';
import { Subject, apiSubjects } from '@/shared/api';

export type SubjectEditingRowProps = {
  id: string;
  refresh: () => Promise<unknown>;
};

export function SubjectEditingRow({
  id: url,
  refresh,
}: SubjectEditingRowProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject, mutate } = useSWR<Subject>(url);

  if (!subject) {
    return null;
  }

  const onSave = async () => {
    await apiSubjects.edit(url, {
      name: nameRef.current?.value,
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
