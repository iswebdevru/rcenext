import { Table } from '@/shared/ui/Table';
import { DashboardLayout } from '@/layouts';
import {
  displayGroupName,
  useGroupDeleteMany,
  useGroups,
} from '@/entities/groups';
import { GroupsCreator, GroupsLoader } from '@/features/groups';
import GroupsUpdater from '@/features/groups/GroupsUpdater';

export default function Groups() {
  const { data: groups } = useGroups();
  const { trigger: deleteGroups } = useGroupDeleteMany();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table<number>
          creator={() => <GroupsCreator />}
          updater={id => <GroupsUpdater id={id} />}
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
          {groups?.map(group => (
            <Table.RowWithId key={group.id} id={group.id}>
              <Table.SelectRowCheckbox />
              <Table.Data>{displayGroupName(group)}</Table.Data>
              <Table.Data>{group.main_block}</Table.Data>
              <Table.EditRowButton />
            </Table.RowWithId>
          ))}
        </Table>
      </div>
    </DashboardLayout>
  );
}
