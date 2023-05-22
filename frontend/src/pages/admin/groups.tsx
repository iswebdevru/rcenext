import { Table } from '@/shared/ui/Table';
import { usePaginatedFetch } from '@/shared/hooks';
import { AdminLayout } from '@/layouts';
import { GroupsCreator } from '@/features/groups';
import GroupsUpdater from '@/features/groups/GroupsUpdater';
import { API_GROUPS, deleteEntities, Group } from '@/shared/api';
import { useState } from 'react';

export default function Groups() {
  const [search, setSearch] = useState('');

  const { data, lastElementRef, mutate } = usePaginatedFetch<Group>(
    `${API_GROUPS}?search=${search}`
  );

  const deleteGroups = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table<string>>
          <Table.ControlPanel
            onDelete={deleteGroups}
            onSearchChange={e => setSearch(e.target.value)}
          />
          <Table.Body<string>
            creator={() => <GroupsCreator refresh={mutate} />}
            updater={url => <GroupsUpdater refresh={mutate} id={url} />}
            header={
              <Table.Row>
                <Table.Head>
                  <Table.SelectAllRowsCheckbox />
                </Table.Head>
                <Table.Head>Группа</Table.Head>
                <Table.Head>Корпус</Table.Head>
                <Table.Head />
              </Table.Row>
            }
          >
            {data
              ?.map(page => page.results)
              .flat()
              .map((group, i, a) => (
                <Table.Row
                  ref={a.length === i + 1 ? lastElementRef : null}
                  key={group.url}
                  rowId={group.url}
                >
                  <Table.Data>
                    <Table.SelectRowCheckbox />
                  </Table.Data>
                  <Table.Data>{group.name}</Table.Data>
                  <Table.Data>{group.main_block}</Table.Data>
                  <Table.Data>
                    <Table.ButtonEdit />
                  </Table.Data>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </AdminLayout>
  );
}
