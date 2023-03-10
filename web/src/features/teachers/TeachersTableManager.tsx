import { useTeacher, useTeacherCreate, useTeacherUpdate } from '@/shared/api';
import { InputText } from '@/shared/ui/input';
import { Table, useTableManagerContext } from '@/shared/ui/Table';
import { useRef } from 'react';

export function TeachersTableManager() {
  const { id, isNew } = useTableManagerContext();
  const { trigger: createTeacher } = useTeacherCreate();
  const { trigger: updateTeacher } = useTeacherUpdate();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);

  const { data: teacher } = useTeacher(isNew ? undefined : (id as number));

  return (
    <Table.ManagerRow
      onCreate={() => {
        const payload = {
          first_name: firstNameRef.current!.value,
          last_name: lastNameRef.current!.value,
          patronymic: patronymicRef.current!.value,
          subjects: [],
        };
        return createTeacher(payload);
      }}
      onUpdate={() => {
        const payload = {
          first_name: firstNameRef.current!.value,
          last_name: lastNameRef.current?.value,
          patronymic: patronymicRef.current!.value,
          subjects: [],
        };
        return updateTeacher({
          id: id as number,
          body: payload,
        });
      }}
    >
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
          required
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
          required
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.patronymic : ''}
          required
          ref={patronymicRef}
        />
      </Table.Data>
    </Table.ManagerRow>
  );
}
