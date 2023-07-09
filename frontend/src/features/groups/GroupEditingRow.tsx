import { useRef } from 'react';
import useSWR from 'swr';
import { fetcher, Group, partiallyUpdateEntity } from '@/shared/api';
import { TextField } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';

export type GroupEditingRowProps = {
  id: string;
  refresh: () => Promise<unknown>;
};

export default function GroupEditingRow({
  id: url,
  refresh,
}: GroupEditingRowProps) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlockRef = useRef<HTMLInputElement>(null);
  const { data: group, mutate } = useSWR<Group>(url, fetcher);

  if (!group) {
    return null;
  }

  const onSave = async () => {
    await partiallyUpdateEntity(url, {
      body: {
        name: groupNameRef.current!.value,
        main_block: parseInt(mainBlockRef.current!.value),
      },
    });
    return Promise.all([refresh(), mutate()]);
  };

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <TextField
          pattern="[А-ЯA-Z]+к?-[1-4]\d{2,}"
          ref={groupNameRef}
          defaultValue={group.name}
        />
      </Table.DataCell>
      <Table.DataCell>
        <TextField
          pattern="[1-9]+"
          ref={mainBlockRef}
          defaultValue={group.main_block}
        />
      </Table.DataCell>
      <Table.DataCell>
        <Table.ButtonUpdate onSave={onSave} />
        <Table.ButtonCancel />
      </Table.DataCell>
    </Table.Row>
  );
}
