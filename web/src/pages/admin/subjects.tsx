import {
  SubjectsCreator,
  SubjectsTableRowPlaceholder,
  SubjectsUpdater,
} from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { usePaginatedFetch } from '@/shared/hooks';
import { Table } from '@/shared/ui/Table';
import { useState } from 'react';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');

  const { data, lastElementRef, mutate } = usePaginatedFetch<Subject>(
    `${API_SUBJECTS}?search=${searchFilter}`
  );

  const deleteSubjects = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table<string>
          creator={() => <SubjectsCreator refresh={mutate} />}
          updater={url => <SubjectsUpdater refresh={mutate} id={url} />}
          header={
            <Table.Row>
              <Table.SelectAllRowsCheckbox />
              <Table.Head>Предмет</Table.Head>
              <Table.Head />
            </Table.Row>
          }
          loader={<SubjectsTableRowPlaceholder />}
          onDelete={deleteSubjects}
          onSearchChange={e => setSearchFilter(e.target.value)}
        >
          {data
            ?.map(page => page.results)
            .flat()
            .map((subject, i, a) => (
              <Table.RowWithId
                ref={a.length === i + 1 ? lastElementRef : null}
                key={subject.url}
                id={subject.url}
              >
                <Table.SelectRowCheckbox />
                <Table.Data>{subject.name}</Table.Data>
                <Table.EditRowButton />
              </Table.RowWithId>
            ))}
        </Table>
      </div>
    </AdminLayout>
  );
}
