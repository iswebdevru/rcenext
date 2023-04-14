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
      <Table.Data />
      <Table.Data>
        <InputText ref={nameRef} defaultValue={subject.name} />
      </Table.Data>
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
