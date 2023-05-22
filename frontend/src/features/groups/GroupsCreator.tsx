import { API_GROUPS, createEntity } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export function GroupsCreator({ refresh }: TableCreatorComponentProps) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlockRef = useRef<HTMLInputElement>(null);

  const onSave = () =>
    createEntity(API_GROUPS, {
      body: {
        name: groupNameRef.current?.value,
        main_block: parseInt(mainBlockRef.current!.value),
      },
    });

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText
          required
          pattern="[А-ЯA-Z]+к?-[1-4]\d{2,}"
          ref={groupNameRef}
        />
      </Table.Data>
      <Table.Data>
        <InputText required pattern="[1-9]+" ref={mainBlockRef} />
      </Table.Data>
      <Table.Data>
        <Table.ButtonCreate onSave={onSave} refresh={refresh} />
        <Table.ButtonCancel />
      </Table.Data>
    </Table.Row>
  );
}
