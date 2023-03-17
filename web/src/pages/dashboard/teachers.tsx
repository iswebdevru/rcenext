import { DashboardLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';
import { useTeacherDeleteMany, useTeachers } from '@/entities/teachers';
import {
  TeachersCreator,
  TeachersTableRowPlaceholder,
  TeachersUpdater,
  TeacherSubjects,
} from '@/features/teachers';

export default function Teachers() {
  const { data } = useTeachers();
  const { trigger: deleteTeachers } = useTeacherDeleteMany();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table<number>
          onDelete={deleteTeachers}
          creator={() => <TeachersCreator />}
          updater={id => <TeachersUpdater id={id} />}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Имя</Table.Head>
              <Table.Head>Фамилия</Table.Head>
              <Table.Head>Отчество</Table.Head>
              <Table.Head>Предметы</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          loader={<TeachersTableRowPlaceholder />}
        >
          {data?.map(teacher => (
            <Table.RowWithId key={teacher.id} id={teacher.id}>
              <Table.SelectRowCheckbox />
              <Table.Data>{teacher.first_name}</Table.Data>
              <Table.Data>{teacher.last_name}</Table.Data>
              <Table.Data>{teacher.patronymic}</Table.Data>
              <Table.Data>
                <TeacherSubjects url={teacher.subjects_url} />
              </Table.Data>
              <Table.EditRowButton />
            </Table.RowWithId>
          ))}
        </Table>
      </div>
    </DashboardLayout>
  );
}
