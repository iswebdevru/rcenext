import { DashboardLayout } from '@/layouts';
import { useTeachers } from '@/shared/api';
import { Table, TableEditRowProps } from '@/shared/ui/Table';

function AddTeacher({ id }: TableEditRowProps) {
  return (
    <>
      <Table.Data>
        <input type="text" />
      </Table.Data>
      <Table.Data>
        <input type="text" />
      </Table.Data>
      <Table.Data>
        <input type="text" />
      </Table.Data>
      <Table.Data>
        <input type="text" />
      </Table.Data>
    </>
  );
}

export default function Teachers() {
  const { data } = useTeachers();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table onDelete={ids => console.log(ids)} EditComponent={AddTeacher}>
          <Table.Row head>
            <Table.Head>Имя</Table.Head>
            <Table.Head>Фамилия</Table.Head>
            <Table.Head>Отчество</Table.Head>
            {/* <Table.Head>Предметы</Table.Head> */}
          </Table.Row>
          {data ? (
            data.map(teacher => (
              <Table.Row key={teacher.id} id={teacher.id}>
                <Table.Data>{teacher.first_name}</Table.Data>
                <Table.Data>{teacher.last_name}</Table.Data>
                <Table.Data>{teacher.patronymic}</Table.Data>
              </Table.Row>
            ))
          ) : (
            <Table.Row id={123}>
              <Table.Data>f</Table.Data>
            </Table.Row>
          )}
        </Table>
      </div>
    </DashboardLayout>
  );
}
