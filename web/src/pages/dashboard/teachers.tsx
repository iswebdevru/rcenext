import { DashboardLayout } from '@/layouts';
import { useTeacherDelete, useTeachers } from '@/shared/api';
import { Id, Table } from '@/shared/ui/Table';
import {
  TeachersTableRowCreate,
  TeachersTableRowUpdate,
  TeacherSubjects,
} from '@/features/teachers';

export default function Teachers() {
  const { data, mutate: refreshTeachers } = useTeachers();
  const { trigger: deleteTeacher } = useTeacherDelete();

  const deleteTeachers = async (ids: Id[]) => {
    await Promise.all(
      ids.map(id => deleteTeacher(id as number, { revalidate: false }))
    );
    refreshTeachers();
  };

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          onDelete={deleteTeachers}
          creator={() => <TeachersTableRowCreate />}
          updater={id => <TeachersTableRowUpdate id={id as number} />}
          header={
            <Table.Row>
              <Table.HeaderSelectCheckbox />
              <Table.Head>Имя</Table.Head>
              <Table.Head>Фамилия</Table.Head>
              <Table.Head>Отчество</Table.Head>
              <Table.Head>Предметы</Table.Head>
              <Table.Head></Table.Head>
            </Table.Row>
          }
          placeholder={
            <Table.Row>
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
              <Table.DataPlaceholder />
            </Table.Row>
          }
        >
          {data?.map(teacher => (
            <Table.RowContent key={teacher.id} id={teacher.id}>
              <Table.RowSelectCheckbox />
              <Table.Data>{teacher.first_name}</Table.Data>
              <Table.Data>{teacher.last_name}</Table.Data>
              <Table.Data>{teacher.patronymic}</Table.Data>
              <Table.Data>
                <TeacherSubjects url={teacher.subjects_url} />
              </Table.Data>
              {/* <Table.RowEditButton /> */}
            </Table.RowContent>
          ))}
        </Table>
      </div>
    </DashboardLayout>
  );
}
