import { SubjectsCreator, SubjectsUpdater } from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { Table } from '@/shared/ui/Table';
import { useState } from 'react';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Subject>(
    `${API_SUBJECTS}?search=${searchFilterDebounced}`
  );

  const deleteSubjects = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table>
          <Table.Controls
            onDelete={deleteSubjects}
            search={searchFilter}
            onSearchChange={setSearchFilter}
          />
          <Table.Body<string>
            creator={() => <SubjectsCreator refresh={mutate} />}
            updater={url => <SubjectsUpdater refresh={mutate} id={url} />}
            header={
              <Table.Row>
                <Table.HeadCell>
                  <Table.SelectAllRowsCheckbox />
                </Table.HeadCell>
                <Table.HeadCell>Предмет</Table.HeadCell>
                <Table.HeadCell />
              </Table.Row>
            }
          >
            {data
              ?.map(page => page.results)
              .flat()
              .map((subject, i, a) => (
                <Table.Row
                  ref={a.length === i + 1 ? lastElementRef : null}
                  key={subject.url}
                  rowId={subject.url}
                >
                  <Table.DataCell>
                    <Table.SelectRowCheckbox />
                  </Table.DataCell>
                  <Table.DataCell>{subject.name}</Table.DataCell>
                  <Table.DataCell>
                    <Table.ButtonEdit />
                  </Table.DataCell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </AdminLayout>
  );
}
