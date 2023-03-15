import { useSubjects } from '@/entities/subjects';
import { DashboardLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';

export default function Subjects() {
  const { data: subjects } = useSubjects();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          creator={() => <></>}
          updater={() => <></>}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Группа</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          placeholder={
            <Table.Row>
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
            </Table.Row>
          }
          onDelete={() => {}}
        >
          {subjects?.map(subject => (
            <Table.RowWithId key={subject.id} id={subject.id}>
              <Table.SelectRowCheckbox />
              <Table.Data>{subject.name}</Table.Data>
              <Table.EditRowButton />
            </Table.RowWithId>
          ))}
        </Table>
      </div>
    </DashboardLayout>
  );
}
