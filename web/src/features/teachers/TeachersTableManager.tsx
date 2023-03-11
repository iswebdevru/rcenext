import { useTeacher, useTeacherCreate, useTeacherUpdate } from '@/shared/api';
import { InputText } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Table, useTableManagerContext } from '@/shared/ui/Table';
import { useRef, useState } from 'react';

type TeacherTableManagerProps = {
  onSave: () => void;
};

export function TeachersTableManager() {
  // const { id, isNew } = useTableManagerContext();
  const { trigger: createTeacher } = useTeacherCreate();
  // const { trigger: updateTeacher } = useTeacherUpdate();

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const selectedSubjects = useState<number[]>([]);

  // const { data: teacher } = useTeacher(isNew ? undefined : (id as number));
  const teacher = null as any;

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
        // const payload = {
        //   first_name: firstNameRef.current!.value,
        //   last_name: lastNameRef.current!.value,
        //   patronymic: patronymicRef.current!.value,
        //   subjects: [],
        // };
        // return updateTeacher({
        //   id: id as number,
        //   body: payload,
        // });
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
      <Table.Data></Table.Data>
    </Table.ManagerRow>
  );
}

export function TeachersTableRowCreate() {}
export function TeachersTableRowUpdate({ id }: { id: number }) {
  const { data: teacher } = useTeacher(id);
  const { trigger: updateTeacher } = useTeacherUpdate();

  if (!teacher) {
    return (
      <Table.RowPlain>
        <Table.DataPlaceholder />
        <Table.DataPlaceholder />
        <Table.DataPlaceholder />
        <Table.DataPlaceholder />
        <Table.DataPlaceholder />
        <Table.DataPlaceholder />
      </Table.RowPlain>
    );
  }

  /**
   * <Table.UpdateRow onSave={() => {}}>
   *    <
   * </Table.UpdateRow>
   */

  return <TeachersTableManager />;
}

// type SelectSubjectProps = {
//   url?: string;
//   selectedSubjects: number[];
//   onChange: (ids: number[]) => void;
// };

// function SelectSubject({
//   url,
//   selectedSubjects,
//   onChange,
// }: SelectSubjectProps) {
//   return (
//     <Select value={1} onChange={v => {}}>
//       <Select.Option value={1}>a</Select.Option>
//       <Select.Option value={2}>a</Select.Option>
//       <Select.Option value={3}>a</Select.Option>
//     </Select>
//   );
// }
