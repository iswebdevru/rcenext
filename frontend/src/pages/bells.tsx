import { BaseLayout } from '@/layouts';
import { getAppDate } from '@/shared/lib/date';
import { Table } from '@/shared/ui/Table';
import { Calendar } from '@/shared/ui/calendar';
import Head from 'next/head';
import { useState } from 'react';

export default function Bells() {
  const [date, setDate] = useState(getAppDate);

  return (
    <>
      <Head>
        <title>Звонки</title>
      </Head>
      <BaseLayout>
        <div className="container flex gap-4 pt-6">
          <div className="flex-auto">
            <Table>
              <Table.Main>
                <Table.Head>
                  <Table.Row>
                    <Table.HeadCell>№</Table.HeadCell>
                    <Table.HeadCell>Время</Table.HeadCell>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.DataCell>0</Table.DataCell>
                    <Table.DataCell>8:00 - 8:55</Table.DataCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.DataCell>0</Table.DataCell>
                    <Table.DataCell>8:00 - 8:55</Table.DataCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.DataCell>0</Table.DataCell>
                    <Table.DataCell>8:00 - 8:55</Table.DataCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.DataCell>0</Table.DataCell>
                    <Table.DataCell>8:00 - 8:55</Table.DataCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.DataCell>0</Table.DataCell>
                    <Table.DataCell>8:00 - 8:55</Table.DataCell>
                  </Table.Row>
                </Table.Body>
              </Table.Main>
            </Table>
          </div>
          <div className="flex-none">
            <Calendar onDateChange={setDate} date={date} />
            <SelectBellsType />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

function SelectBellsType() {
  return null;
}
