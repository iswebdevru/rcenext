import useSWR from 'swr';
import { fetcher, Group, partiallyUpdateEntity } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export default function GroupsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlockRef = useRef<HTMLInputElement>(null);
  const { data: group, mutate } = useSWR<Group>(url, fetcher);

  if (!group) {
    return null;
  }

  const onSave = () =>
    partiallyUpdateEntity(url, {
      body: {
        name: groupNameRef.current!.value,
        main_block: parseInt(mainBlockRef.current!.value),
      },
    });

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <InputText
          pattern="[А-ЯA-Z]+к?-[1-4]\d{2,}"
          ref={groupNameRef}
          defaultValue={group.name}
        />
      </Table.DataCell>
      <Table.DataCell>
        <InputText
          pattern="[1-9]+"
          ref={mainBlockRef}
          defaultValue={group.main_block}
        />
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
