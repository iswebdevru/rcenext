import { Teacher } from '@/shared/api';
import { Table } from '@/shared/ui/Table';
import { TeacherSubjects } from './TeacherSubjects';

export type TeachersTableRowProps = {
  data: Teacher;
};

export function TeachersTableRow({ data }: TeachersTableRowProps) {
  return (
    <Table.Row id={data.id}>
      <Table.Data>{data.first_name}</Table.Data>
      <Table.Data>{data.last_name}</Table.Data>
      <Table.Data>{data.patronymic}</Table.Data>
      <Table.Data>
        <TeacherSubjects url={data.subjects_url} />
      </Table.Data>
    </Table.Row>
  );
}
