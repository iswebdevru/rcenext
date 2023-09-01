import { useRef } from 'react';
import useSWR from 'swr';
import { Group, apiGroups } from '@/shared/api';
import { TextField } from '@/shared/ui/Controls';
import {
  TableButtonCancel,
  TableButtonUpdate,
  TableDataCell,
  TableRow,
} from '@/shared/ui/Table';
import { useRouter } from 'next/navigation';

export type GroupEditingRowProps = {
  id: string;
};

export default function GroupEditingRow({ id: url }: GroupEditingRowProps) {
  const router = useRouter();
  const groupNameRef = useRef<HTMLInputElement>(null);
  const mainBlockRef = useRef<HTMLInputElement>(null);
  const { data: group, mutate } = useSWR<Group>(url);

  if (!group) {
    return null;
  }

  const onSave = async () => {
    await apiGroups.edit(url, {
      name: groupNameRef.current!.value,
      main_block: parseInt(mainBlockRef.current!.value),
    });
    return Promise.all([mutate(), router.refresh()]);
  };

  return (
    <TableRow>
      <TableDataCell />
      <TableDataCell>
        <TextField
          pattern="[А-ЯA-Z]+к?-[1-4]\d{2,}"
          ref={groupNameRef}
          defaultValue={group.name}
        />
      </TableDataCell>
      <TableDataCell>
        <TextField
          pattern="[1-9]+"
          ref={mainBlockRef}
          defaultValue={group.main_block}
        />
      </TableDataCell>
      <TableDataCell>
        <TableButtonUpdate onSave={onSave} />
        <TableButtonCancel />
      </TableDataCell>
    </TableRow>
  );
}
