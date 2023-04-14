import { SubjectsCreator, SubjectsUpdater } from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { LoaderWrapper } from '@/shared/ui/LoaderWrapper';
import { Table } from '@/shared/ui/Table';
import { useState } from 'react';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');

  const { data, lastElementRef, mutate, isValidating } =
    usePaginatedFetch<Subject>(`${API_SUBJECTS}?search=${searchFilter}`);

  const deleteSubjects = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table>
          <Table.Header
            onDelete={deleteSubjects}
            onSearchChange={e => setSearchFilter(e.target.value)}
          />
          <LoaderWrapper enabled={isValidating}>
            <Table.Body<string>
              creator={() => <SubjectsCreator refresh={mutate} />}
              updater={url => <SubjectsUpdater refresh={mutate} id={url} />}
              header={
                <Table.Row>
                  <Table.SelectAllRowsCheckbox />
                  <Table.Head>Предмет</Table.Head>
                  <Table.Head />
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
                    <Table.SelectRowCheckbox />
                    <Table.Data>{subject.name}</Table.Data>
                    <Table.EditRowButton />
                  </Table.Row>
                ))}
            </Table.Body>
          </LoaderWrapper>
        </Table>
      </div>
    </AdminLayout>
  );
}
