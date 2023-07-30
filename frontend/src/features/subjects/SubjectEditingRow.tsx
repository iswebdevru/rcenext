import { useRef } from 'react';
import useSWR from 'swr';
import { TextField } from '@/shared/ui/Controls';
import {
  TableButtonCancel,
  TableButtonUpdate,
  TableDataCell,
  TableRow,
} from '@/shared/ui/Table';
import { Subject, apiSubjects } from '@/shared/api';

export type SubjectEditingRowProps = {
  id: string;
  refresh: () => Promise<unknown>;
};

export function SubjectEditingRow({
  id: url,
  refresh,
}: SubjectEditingRowProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject, mutate } = useSWR<Subject>(url);

  if (!subject) {
    return null;
  }

  const onSave = async () => {
    await apiSubjects.edit(url, {
      name: nameRef.current?.value,
    });
    return Promise.all([refresh(), mutate()]);
  };

  return (
    <TableRow>
      <TableDataCell />
      <TableDataCell>
        <TextField ref={nameRef} defaultValue={subject.name} />
      </TableDataCell>
      <TableDataCell>
        <TableButtonUpdate onSave={onSave} />
        <TableButtonCancel />
      </TableDataCell>
    </TableRow>
  );
}
