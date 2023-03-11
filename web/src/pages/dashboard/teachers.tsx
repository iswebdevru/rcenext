import { DashboardLayout } from '@/layouts';
import { Teacher, useTeacherDelete, useTeachers } from '@/shared/api';
import { Table } from '@/shared/ui/Table';
import {
  TeachersTableManager,
  TeachersTableRowPlaceholder,
  TeacherSubjects,
} from '@/features/teachers';

export default function Teachers() {
  const { data } = useTeachers();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          creator={() => <TeachersTableManager />}
          updater={id => <TeachersTableManager />}
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
            data.map(teacher => <TeacherRow key={teacher.id} data={teacher} />)
          ) : (
            <TeachersTableRowPlaceholder />
          )}
        </Table>
      </div>
    </DashboardLayout>
  );
}

type TeacherRowProps = {
  data: Teacher;
};

function TeacherRow({ data }: TeacherRowProps) {
  const { trigger } = useTeacherDelete(data.id);
  return (
    <Table.Row id={data.id} onDelete={trigger}>
      <Table.Data>{data.first_name}</Table.Data>
      <Table.Data>{data.last_name}</Table.Data>
      <Table.Data>{data.patronymic}</Table.Data>
      <Table.Data>
        <TeacherSubjects url={data.subjects_url} />
      </Table.Data>
    </Table.Row>
  );
}
