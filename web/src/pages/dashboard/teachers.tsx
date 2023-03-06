import { DashboardLayout } from '@/layouts';
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
  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table onDelete={ids => console.log(ids)} EditComponent={AddTeacher}>
          <Table.Row head>
            <Table.Head>Имя</Table.Head>
            <Table.Head>Фамилия</Table.Head>
            <Table.Head>Отчество</Table.Head>
            <Table.Head>Предметы</Table.Head>
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
          <Table.Row id={5}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={6}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={7}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={8}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={9}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={234}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={3457354}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={712}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={1345}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={1334545}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={134635}>
            <Table.Data>Владимир</Table.Data>
            <Table.Data>Героев</Table.Data>
            <Table.Data>Конкретнович</Table.Data>
            <Table.Data>Математика, физика, информатика</Table.Data>
          </Table.Row>
          <Table.Row id={13235445}>
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
