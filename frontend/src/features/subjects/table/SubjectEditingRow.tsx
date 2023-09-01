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
import { useRouter } from 'next/navigation';

export type SubjectEditingRowProps = {
  id: string;
};

export function SubjectEditingRow({ id: url }: SubjectEditingRowProps) {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const { data: subject, mutate } = useSWR<Subject>(url);

  if (!subject) {
    return null;
  }

  const onSave = async () => {
    await apiSubjects.edit(url, {
      name: nameRef.current?.value,
    });
    return Promise.all([router.refresh(), mutate()]);
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
