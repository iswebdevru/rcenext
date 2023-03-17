import {
  displayGroupName,
  parseGroupName,
  useGroup,
  useGroupUpdate,
} from '@/entities/groups';
import { InputText } from '@/shared/ui/Input';
import { Table } from '@/shared/ui/Table';
import { useRef } from 'react';
import { GroupsLoader } from './GroupsLoader';

export default function GroupsUpdater({ slug }: { slug: string }) {
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlock = useRef<HTMLInputElement>(null);

  const { data: group } = useGroup(slug);
  const updateGroup = useGroupUpdate();

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
        onSave={() => {
          return updateGroup(slug, {
            ...parseGroupName(groupNameRef.current!.value),
            main_block: parseInt(mainBlock.current!.value),
          });
        }}
      />
    </Table.Row>
  );
}
