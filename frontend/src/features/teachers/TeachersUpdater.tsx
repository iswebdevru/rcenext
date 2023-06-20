import { useEffect, useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { SelectSubjects } from '../subjects/SelectSubjects';
import { fetcher, partiallyUpdateEntity, Teacher } from '@/shared/api';
import useSWR from 'swr';

export function TeachersUpdater({
  id: url,
  refresh,
}: TableUpdaterComponentProps<string>) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[] | null>(
    null
  );

  const { data: teacher, mutate } = useSWR<Teacher>(url, fetcher);

  useEffect(() => {
    if (!selectedSubjects && teacher) {
      setSelectedSubjects(teacher.subjects);
    }
  }, [selectedSubjects, teacher]);

  if (!teacher) {
    return null;
  }

  const onSave = async () => {
    await partiallyUpdateEntity(url, {
      body: {
        first_name: firstNameRef.current?.value,
        last_name: lastNameRef.current?.value,
        patronymic: patronymicRef.current?.value,
        subjects: selectedSubjects,
      },
    });
    return Promise.all([refresh(), mutate()]);
  };

  return (
    <Table.Row>
      <Table.DataCell />
      <Table.DataCell>
        <InputText
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
        />
      </Table.DataCell>
      <Table.DataCell>
        <InputText
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
        />
      </Table.DataCell>
      <Table.DataCell>
        <InputText
          defaultValue={teacher ? teacher.patronymic : ''}
          ref={patronymicRef}
        />
      </Table.DataCell>
      {selectedSubjects ? (
        <Table.DataCell>
          <SelectSubjects
            value={selectedSubjects}
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
