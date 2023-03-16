import { useSubjectDeleteMany, useSubjects } from '@/entities/subjects';
import {
  SubjectsCreator,
  SubjectsTableRowPlaceholder,
  SubjectsUpdater,
} from '@/features/subjects';
import { DashboardLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';

export default function Subjects() {
  const { data: subjects } = useSubjects();
  const { trigger: deleteSubjects } = useSubjectDeleteMany();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table<number>
          creator={() => <SubjectsCreator />}
          updater={id => <SubjectsUpdater id={id} />}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Предмет</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          placeholder={<SubjectsTableRowPlaceholder />}
          onDelete={ids => deleteSubjects(ids)}
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
