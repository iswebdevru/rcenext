import { useState } from 'react';
import { BaseLayout } from '@/layouts';
import { getAppDate } from '@/shared/lib/date';
import { Table } from '@/shared/ui/Table';
import { Calendar } from '@/shared/ui/calendar';
import Head from 'next/head';
import { SelectBeta, SelectBetaOption } from '@/shared/ui/select';
import { Button } from '@/shared/ui/controls';

export default function Bells() {
  const [date, setDate] = useState(getAppDate);
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

const BELLS_TYPES = {
  normal: 'Основной',
  reduced: 'Сокращенный',
} as const;

type BellsType = keyof typeof BELLS_TYPES;

type SelectBellsTypeProps = {
  type: BellsType;
  onChange: (type: BellsType) => void;
};

function SelectBellsType({ type, onChange }: SelectBellsTypeProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <SelectBeta
      isRevealed={isRevealed}
      onClose={() => setIsRevealed(false)}
      inputElement={
        <Button onClick={() => setIsRevealed(true)}>{BELLS_TYPES[type]}</Button>
      }
    >
      {Object.entries(BELLS_TYPES).map(([key, value]) => (
        <SelectBetaOption
          key={key}
          onSelect={() => onChange(key as BellsType)}
          selected={type === key}
        >
          {value}
        </SelectBetaOption>
      ))}
    </SelectBeta>
  );
}
