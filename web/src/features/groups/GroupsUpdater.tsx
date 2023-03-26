import useSWR from 'swr';
import { displayGroupName, parseGroupName } from '@/entities/groups';
import { fetcher, Group } from '@/shared/api';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { useRef } from 'react';
import { GroupsLoader } from './GroupsLoader';

export default function GroupsUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlock = useRef<HTMLInputElement>(null);
  const { data: group } = useSWR<Group>(url, fetcher);

  if (!group) {
    return <GroupsLoader />;
  }

  return (
    <Table.Row>
      <Table.Data />
      <Table.Data>
        <InputText
          pattern="[А-ЯA-Z]+к?-[1-4]\d{2,}"
          ref={groupNameRef}
          defaultValue={displayGroupName(group)}
        />
      </Table.Data>
      <Table.Data>
        <InputText
          pattern="[1-9]+"
          ref={mainBlock}
          defaultValue={group.main_block}
        />
      </Table.Data>
      <Table.EditorActions
        onSave={async () => {
          await fetcher.patch(url, {
            ...parseGroupName(groupNameRef.current!.value),
            main_block: parseInt(mainBlock.current!.value),
          });
          refresh();
        }}
      />
    </Table.Row>
  );
}
