import { Table } from '@/shared/ui/Table';

export function SubjectsTableRowPlaceholder() {
  return (
    <Table.Row>
      <Table.DataLoader />
      <Table.DataLoader />
      <Table.DataLoader />
    </Table.Row>
  );
}
