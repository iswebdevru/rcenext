import { DashboardLayout } from '@/layouts';
import { useTeacher, useTeachers } from '@/shared/api';
import { InputText } from '@/shared/ui/input';
import { Table, useTableManagerContext } from '@/shared/ui/Table';
import { useState } from 'react';

function ManageTeacher() {
  const { id, isNew } = useTableManagerContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [patronymic, setPatronymic] = useState('');

  useTeacher(isNew ? undefined : (id as number), {
    onSuccess: data => {
      setFirstName(data.first_name);
      setLastName(data.last_name);
      setPatronymic(data.patronymic);
    },
  });

  return (
    <Table.EditRow
      onCreate={() => {
        console.log('created');
      }}
      onUpdate={() => {
        console.log('updated');
      }}
    >
      <Table.Data>
        <InputText
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
        />
      </Table.Data>
      <Table.Data>
        <InputText
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
        />
      </Table.Data>
      <Table.Data>
        <InputText
          value={patronymic}
          onChange={e => setPatronymic(e.target.value)}
          required
        />
      </Table.Data>
    </Table.EditRow>
  );
}

export default function Teachers() {
  const { data } = useTeachers();

  return (
    <DashboardLayout>
      <div className="h-full p-6">
        <Table
          onDelete={() => console.log('deleted')}
          manager={<ManageTeacher />}
          cols={3}
          header={
            <Table.HeaderRow>
              <Table.Head>Имя</Table.Head>
              <Table.Head>Фамилия</Table.Head>
              <Table.Head>Отчество</Table.Head>
            </Table.HeaderRow>
          }
        >
          {data
            ? data.map(teacher => (
                <Table.Row key={teacher.id} id={teacher.id}>
                  <Table.Data>{teacher.first_name}</Table.Data>
                  <Table.Data>{teacher.last_name}</Table.Data>
                  <Table.Data>{teacher.patronymic}</Table.Data>
                </Table.Row>
              ))
            : null}
        </Table>
      </div>
    </DashboardLayout>
  );
}
