import { Table } from '@/shared/ui/Table';
import { AdminLayout } from '@/layouts';
import { displayGroupName } from '@/entities/groups';
import { GroupsCreator, GroupsLoader } from '@/features/groups';
import GroupsUpdater from '@/features/groups/GroupsUpdater';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_GROUPS, fetcher, Group } from '@/shared/api';

export default function Groups() {
  const { data, lastElementRef, mutate } = usePaginatedFetch<Group>(API_GROUPS);

  const deleteGroups = async (urls: string[]) => {
    await Promise.all(urls.map(url => fetcher.delete(url)));
    mutate();
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
