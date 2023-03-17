import { parseGroupName, useGroupCreate } from '@/entities/groups';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useRef } from 'react';

export function GroupsCreator() {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlock = useRef<HTMLInputElement>(null);

  const { trigger: createGroup } = useGroupCreate();

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
        <InputText required pattern="[1-9]+" ref={mainBlock} />
      </Table.Data>
      <Table.Data></Table.Data>
      <Table.EditorActions
        onSave={() => {
          return createGroup({
            ...parseGroupName(groupNameRef.current!.value),
            main_block: parseInt(mainBlock.current!.value),
          });
        }}
      />
    </Table.Row>
  );
}
