import { DashboardLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';

export default function Teachers() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Table onDelete={ids => console.log(ids)}>
          <Table.Row head>
            <Table.Head>Имя</Table.Head>
            <Table.Head>Фамилия</Table.Head>
            <Table.Head>Отчество</Table.Head>
            <Table.Head>Предметы</Table.Head>
          </Table.Row>
          <Table.Row creator>
            <Table.Data>editing</Table.Data>
            <Table.Data>editing</Table.Data>
            <Table.Data>editing</Table.Data>
            <Table.Data>editing</Table.Data>
          </Table.Row>
          <Table.Row id={1}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={2}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={3}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={4}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
        </Table>
      </div>
    </DashboardLayout>
  );
}
