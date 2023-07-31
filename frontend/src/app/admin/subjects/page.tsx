'use client';

import { useState } from 'react';
import { SubjectCreateForm, SubjectEditingRow } from '@/features/subjects';
import { API_SUBJECTS, Subject, apiSubjects } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { Button } from '@/shared/ui/Controls/Button';
import {
  Table,
  TableBody,
  TableButtonEdit,
  TableControls,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableMain,
  TableRow,
  TableSelectAllRowsCheckbox,
  TableSelectRowCheckbox,
} from '@/shared/ui/Table';
import { Title } from '@/shared/ui/Typography';
import { Reveal } from '@/shared/ui/Utils/Reveal';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Subject>(
    `${API_SUBJECTS}?search=${searchFilterDebounced}`,
  );

  const deleteSubjects = async (urls: string[]) => {
    await Promise.all(urls.map(apiSubjects.delete));
    return mutate();
  };

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-6 pb-6">
        <Title>Предметы</Title>
        <div>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setIsFormVisible(true);
            }}
          >
            Добавить
          </Button>
        </div>
      </div>
      <Reveal isVisible={isFormVisible}>
        <div className="mb-6">
          <SubjectCreateForm
            refresh={mutate}
            onClose={() => setIsFormVisible(false)}
          />
        </div>
      </Reveal>
      <Table>
        <TableControls
          onDelete={deleteSubjects}
          search={searchFilter}
          onSearchChange={setSearchFilter}
        />
        <TableMain>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <TableSelectAllRowsCheckbox />
              </TableHeadCell>
              <TableHeadCell>Предмет</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody<string>
            editingRow={url => <SubjectEditingRow refresh={mutate} id={url} />}
          >
            {data
              ?.map(page => page.results)
              .flat()
              .map((subject, i, a) => (
                <TableRow
                  ref={a.length === i + 1 ? lastElementRef : null}
                  key={subject.url}
                  rowId={subject.url}
                >
                  <TableDataCell>
                    <TableSelectRowCheckbox />
                  </TableDataCell>
                  <TableDataCell>{subject.name}</TableDataCell>
                  <TableDataCell>
                    <TableButtonEdit />
                  </TableDataCell>
                </TableRow>
              ))}
          </TableBody>
        </TableMain>
      </Table>
    </div>
  );
}

// export const metadata = {
//   title: 'Предметы',
// };
