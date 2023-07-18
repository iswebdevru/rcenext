import { useState } from 'react';
import { BaseLayout } from '@/layouts';
import { getAppDate } from '@/shared/lib/date';
import { Table } from '@/shared/ui/Table';
import { Calendar } from '@/shared/ui/calendar';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { BellsType, SelectBellsType } from '@/shared/ui/Select';

type BellsProps = {
  date: string;
};

export default function Bells({ date: initDate }: BellsProps) {
  const [date, setDate] = useState(new Date(initDate));
  const [bellsType, setBellsType] = useState<BellsType>('normal');

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
          <div className="flex-none space-y-4">
            <Calendar onDateChange={setDate} date={date} />
            <SelectBellsType type={bellsType} onChange={setBellsType} />
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<BellsProps> = async () => {
  return {
    props: {
      date: getAppDate(),
    },
  };
};
