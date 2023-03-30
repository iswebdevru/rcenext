import { useEffect, useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { Table, TableUpdaterComponentProps } from '@/shared/ui/Table';
import { TeachersTableRowPlaceholder } from './TeachersTableRowPlaceholder';
import { SelectSubjects } from '../subjects/SelectSubjects';
import useSWR from 'swr';
import { fetcher, partiallyUpdateEntity, Teacher } from '@/shared/api';

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
    return <TeachersTableRowPlaceholder />;
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
      <Table.Data />
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.first_name : ''}
          ref={firstNameRef}
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.last_name : ''}
          ref={lastNameRef}
        />
      </Table.Data>
      <Table.Data>
        <InputText
          defaultValue={teacher ? teacher.patronymic : ''}
          ref={patronymicRef}
        />
      </Table.Data>
      {selectedSubjects ? (
        <Table.Data>
          <SelectSubjects
            value={selectedSubjects}
            onChange={setSelectedSubjects}
          />
        </Table.Data>
      ) : (
        <Table.DataLoader />
      )}
      <Table.EditorActions onSave={onSave} />
    </Table.Row>
  );
}
