import { parseGroupName } from '@/entities/groups';
import { API_GROUPS, fetcher } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableCreatorComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';

export function GroupsCreator({ refresh }: TableCreatorComponentProps) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlock = useRef<HTMLInputElement>(null);

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
        onSave={async () => {
          await fetcher.post(API_GROUPS, {
            ...parseGroupName(groupNameRef.current!.value),
            main_block: parseInt(mainBlock.current!.value),
          });
          refresh();
        }}
      />
    </Table.Row>
  );
}
