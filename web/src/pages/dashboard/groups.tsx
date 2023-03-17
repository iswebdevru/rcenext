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
        <Table<string>
          creator={() => <GroupsCreator />}
          updater={slug => <GroupsUpdater slug={slug} />}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Группа</Table.Head>
              <Table.Head>Корпус</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          onDelete={slugs => deleteGroups(slugs)}
          loader={<GroupsLoader />}
        >
          {groups?.map(group => (
            <Table.RowWithId key={group.slug} id={group.slug}>
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
