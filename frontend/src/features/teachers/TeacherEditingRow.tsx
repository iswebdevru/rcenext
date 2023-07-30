import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { TextField } from '@/shared/ui/Controls';
import {
  TableButtonCancel,
  TableButtonUpdate,
  TableDataCell,
  TableDataLoader,
  TableRow,
} from '@/shared/ui/Table';
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
    <TableRow>
      <TableDataCell />
      <TableDataCell>
        <TextField
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
        />
      </TableDataCell>
      <TableDataCell>
        <TextField
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
        />
      </TableDataCell>
      <TableDataCell>
        <TextField
          defaultValue={teacher ? teacher.patronymic : ''}
          ref={patronymicRef}
        />
      </TableDataCell>
      {selectedSubjects ? (
        <TableDataCell>
          <SelectSubjects
            selectedSubjects={selectedSubjects}
            onChange={setSelectedSubjects}
          />
        </TableDataCell>
      ) : (
        <TableDataLoader />
      )}
      <TableDataCell>
        <TableButtonUpdate onSave={onSave} />
        <TableButtonCancel />
      </TableDataCell>
    </TableRow>
  );
}
