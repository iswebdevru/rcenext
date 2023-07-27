'use client'; //todo: fix

import { BellsMixed } from '@/shared/api';
import { Table } from '@/shared/ui/Table';

export type BellsScheduleTableProps = {
  data: BellsMixed;
};

export function BellsScheduleTable({ data }: BellsScheduleTableProps) {
  return (
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
  );
}
