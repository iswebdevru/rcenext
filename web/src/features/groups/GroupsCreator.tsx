import { parseGroupName } from '@/entities/groups';
import { API_GROUPS, createEntity } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export function GroupsCreator({ refresh }: TableCreatorComponentProps) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlock = useRef<HTMLInputElement>(null);

  const onSave = async () => {
    await createEntity(API_GROUPS, {
      body: {
        ...parseGroupName(groupNameRef.current!.value),
        main_block: parseInt(mainBlock.current!.value),
      },
    });
    return refresh();
  };

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
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
