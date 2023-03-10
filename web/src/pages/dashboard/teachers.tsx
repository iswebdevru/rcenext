import { DashboardLayout } from '@/layouts';
import { useTeacherDelete, useTeachers } from '@/shared/api';
import { Id, Table } from '@/shared/ui/Table';
import { TeachersTableManager } from '@/features/teachers';

export default function Teachers() {
  const { data, mutate: refetchTeachers } = useTeachers();
  const { trigger: deleteTeacher } = useTeacherDelete();

  const deleteTeachers = async (ids: Id[]) => {
    await Promise.all(
      ids.map(id => deleteTeacher(id as number, { revalidate: false }))
    );
    refetchTeachers();
  };

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          onDelete={deleteTeachers}
          manager={<TeachersTableManager />}
          header={
            <Table.HeaderRow>
              <Table.Head>Имя</Table.Head>
              <Table.Head>Фамилия</Table.Head>
              <Table.Head>Отчество</Table.Head>
            </Table.HeaderRow>
          }
          cols={3}
        >
          {data
            ? data.map(teacher => (
                <Table.Row key={teacher.id} id={teacher.id}>
                  <Table.Data>{teacher.first_name}</Table.Data>
                  <Table.Data>{teacher.last_name}</Table.Data>
                  <Table.Data>{teacher.patronymic}</Table.Data>
                </Table.Row>
              ))
            : null}
        </Table>
      </div>
    </DashboardLayout>
  );
}
