import { DashboardLayout } from '@/layouts';
import { useTeacherDelete, useTeachers } from '@/shared/api';
import { Id, Table } from '@/shared/ui/Table';
import {
  TeachersTableRow,
  TeachersTableRowCreate,
  TeachersTableRowPlaceholder,
  TeachersTableRowUpdate,
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

  const allItems = data ? data.map(t => t.id) : [];

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          allItems={allItems}
          onDelete={deleteTeachers}
          creator={() => <TeachersTableRowCreate />}
          updater={id => <TeachersTableRowUpdate id={id as number} />}
          header={
            <Table.HeaderRow>
              <Table.Head>Имя</Table.Head>
              <Table.Head>Фамилия</Table.Head>
              <Table.Head>Отчество</Table.Head>
              <Table.Head>Предметы</Table.Head>
            </Table.HeaderRow>
          }
        >
          {data ? (
            data.map(teacher => (
              <TeachersTableRow key={teacher.id} data={teacher} />
            ))
          ) : (
            <>
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
              <TeachersTableRowPlaceholder />
            </>
          )}
        </Table>
      </div>
    </DashboardLayout>
  );
}
