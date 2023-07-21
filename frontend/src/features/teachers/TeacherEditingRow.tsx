import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { TextField } from '@/shared/ui/Controls';
import { Table } from '@/shared/ui/Table';
import { Hyperlink, Teacher, apiTeachers } from '@/shared/api';
import { SelectSubjects } from '../subjects/SelectSubjects'; // TODO: fix one-level cross import

export type TeacherEditingRowProps = {
  id: string;
  refresh: () => Promise<unknown>;
};

export function TeacherEditingRow({
  id: url,
  refresh,
}: TeacherEditingRowProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Hyperlink>>(
    new Set<Hyperlink>(),
  );

  const { data: teacher, mutate } = useSWR<Teacher>(url);

  useEffect(() => {
    if (teacher) {
      setSelectedSubjects(new Set(teacher.subjects));
    }
  }, [selectedSubjects, teacher]);

  if (!teacher) {
    return null;
  }

  const onSave = async () => {
    await apiTeachers.edit(url, {
      first_name: firstNameRef.current?.value,
      last_name: lastNameRef.current?.value,
      patronymic: patronymicRef.current?.value,
      subjects: [...selectedSubjects],
    });
    return Promise.all([refresh(), mutate()]);
  };

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <TextField
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
        />
      </Table.DataCell>
      <Table.DataCell>
        <TextField
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
        />
      </Table.DataCell>
      <Table.DataCell>
        <TextField
          defaultValue={teacher ? teacher.patronymic : ''}
          ref={patronymicRef}
        />
      </Table.DataCell>
      {selectedSubjects ? (
        <Table.DataCell>
          <SelectSubjects
            selectedSubjects={selectedSubjects}
            onChange={setSelectedSubjects}
          />
        </Table.DataCell>
      ) : (
        <Table.DataLoader />
      )}
      <Table.DataCell>
        <Table.ButtonUpdate onSave={onSave} />
        <Table.ButtonCancel />
      </Table.DataCell>
    </Table.Row>
  );
}
