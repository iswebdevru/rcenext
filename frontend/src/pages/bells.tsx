import { useState } from 'react';
import { BaseLayout } from '@/layouts';
import { formatDate, getAppDate } from '@/shared/lib/date';
import { Table } from '@/shared/ui/Table';
import { Calendar } from '@/shared/ui/calendar';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { BellsType, SelectBellsType } from '@/shared/ui/Select';
import useSWR from 'swr';
import { API_BELLS, BellsMixed, fetcher } from '@/shared/api';

type BellsProps = {
  date: string;
};

export default function Bells({ date: initDate }: BellsProps) {
  const [date, setDate] = useState(new Date(initDate));
  const [bellsType, setBellsType] = useState<BellsType>('normal');

  const { data } = useSWR<BellsMixed>(
    `${API_BELLS}?date=${formatDate(date)}`,
    fetcher,
  );

  return (
    <>
      <Head>
        <title>Звонки</title>
      </Head>
      <BaseLayout>
        <div className="container flex gap-4 pt-6">
          <div className="flex-auto">
            {data ? (
              <Table>
                <Table.Main>
                  <Table.Head>
                    <Table.Row>
                      <Table.HeadCell>№</Table.HeadCell>
                      <Table.HeadCell>Время</Table.HeadCell>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    {data.periods.map(period => (
                      <Table.Row key={period.index}>
                        <Table.DataCell>{period.index}</Table.DataCell>
                        <Table.DataCell>
                          <div className="space-y-2">
                            <div>
                              {period.period_from}
                              {' - '}
                              {period.period_to}
                            </div>
                            {period.has_break ? (
                              <div>
                                {period.period_from_after}
                                {' - '}
                                {period.period_to_after}
                              </div>
                            ) : null}
                          </div>
                        </Table.DataCell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Main>
              </Table>
            ) : (
              'Not found'
            )}
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
