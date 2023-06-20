import { Table } from '@/shared/ui/Table';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { AdminLayout } from '@/layouts';
import { GroupsCreator } from '@/features/groups';
import GroupsUpdater from '@/features/groups/GroupsUpdater';
import { API_GROUPS, deleteEntities, Group } from '@/shared/api';
import { useState } from 'react';

export default function Groups() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounce = useDebounce(searchFilter);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Group>(
    `${API_GROUPS}?search=${searchFilterDebounce}`
  );

  const deleteGroups = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table<string>>
          <Table.Controls
            onDelete={deleteGroups}
            search={searchFilter}
            onSearchChange={setSearchFilter}
          />
          <Table.Body<string>
            creator={() => <GroupsCreator refresh={mutate} />}
            updater={url => <GroupsUpdater refresh={mutate} id={url} />}
            header={
              <Table.Row>
                <Table.HeadCell>
                  <Table.SelectAllRowsCheckbox />
                </Table.HeadCell>
                <Table.HeadCell>Группа</Table.HeadCell>
                <Table.HeadCell>Корпус</Table.HeadCell>
                <Table.HeadCell />
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
                  <Table.DataCell>
                    <Table.SelectRowCheckbox />
                  </Table.DataCell>
                  <Table.DataCell>{group.name}</Table.DataCell>
                  <Table.DataCell>{group.main_block}</Table.DataCell>
                  <Table.DataCell>
                    <Table.ButtonEdit />
                  </Table.DataCell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </AdminLayout>
  );
}
