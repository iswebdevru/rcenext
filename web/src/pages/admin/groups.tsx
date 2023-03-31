import { Table } from '@/shared/ui/Table';
import { AdminLayout } from '@/layouts';
import {
  displayGroupName,
  groupRegExp,
  parseGroupName,
} from '@/entities/groups';
import { GroupsCreator, GroupsLoader } from '@/features/groups';
import GroupsUpdater from '@/features/groups/GroupsUpdater';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_GROUPS, deleteEntities, Group } from '@/shared/api';
import { useState } from 'react';

export default function Groups() {
  const [search, setSearch] = useState('');
  const normalizedSearch = groupRegExp.test(search)
    ? Object.values(parseGroupName(search))
        .map(v => (!v ? 0 : v))
        .join(' ')
    : search;

  const { data, lastElementRef, mutate } = usePaginatedFetch<Group>(
    `${API_GROUPS}?search=${normalizedSearch}`
  );

  const deleteGroups = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table<string>
          creator={() => <GroupsCreator refresh={mutate} />}
          updater={url => <GroupsUpdater refresh={mutate} id={url} />}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Группа</Table.Head>
              <Table.Head>Корпус</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          onDelete={ids => deleteGroups(ids)}
          loader={<GroupsLoader />}
          onSearchChange={e => setSearch(e.target.value)}
        >
          {data
            ?.map(page => page.results)
            .flat()
            .map((group, i, a) => (
              <Table.RowWithId
                ref={a.length === i + 1 ? lastElementRef : null}
                key={group.url}
                id={group.url}
              >
                <Table.SelectRowCheckbox />
                <Table.Data>{displayGroupName(group)}</Table.Data>
                <Table.Data>{group.main_block}</Table.Data>
                <Table.EditRowButton />
              </Table.RowWithId>
            ))}
        </Table>
      </div>
    </AdminLayout>
  );
}
