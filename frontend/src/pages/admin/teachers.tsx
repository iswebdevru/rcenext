import { AdminLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';
import {
  TeachersCreator,
  TeacherSubject,
  TeachersUpdater,
} from '@/features/teachers';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { API_TEACHERS, deleteEntities, Teacher } from '@/shared/api';
import { useState } from 'react';

export default function Teachers() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const { data, lastElementRef, mutate } = usePaginatedFetch<Teacher>(
    `${API_TEACHERS}?search=${searchFilterDebounced}`
  );

  const deleteTeachers = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table>
          <Table.ControlPanel
            onDelete={deleteTeachers}
            search={searchFilter}
            onSearchChange={setSearchFilter}
          />
          <Table.Body<string>
            creator={() => <TeachersCreator refresh={mutate} />}
            updater={url => <TeachersUpdater refresh={mutate} id={url} />}
            header={
              <Table.Row>
                <Table.Head>
                  <Table.SelectAllRowsCheckbox />
                </Table.Head>
                <Table.Head>Имя</Table.Head>
                <Table.Head>Фамилия</Table.Head>
                <Table.Head>Отчество</Table.Head>
                <Table.Head>Предметы</Table.Head>
                <Table.Head />
              </Table.Row>
            }
          >
            {data
              ?.map(page => page.results)
              .flat()
              .map((teacher, i, a) => (
                <Table.Row
                  key={teacher.url}
                  rowId={teacher.url}
                  ref={a.length === i + 1 ? lastElementRef : null}
                >
                  <Table.Data>
                    <Table.SelectRowCheckbox />
                  </Table.Data>
                  <Table.Data>{teacher.first_name}</Table.Data>
                  <Table.Data>{teacher.last_name}</Table.Data>
                  <Table.Data>{teacher.patronymic}</Table.Data>
                  <Table.Data>
                    <div className="flex flex-wrap">
                      {teacher.subjects.map(subjectUrl => (
                        <TeacherSubject key={subjectUrl} url={subjectUrl} />
                      ))}
                    </div>
                  </Table.Data>
                  <Table.Data>
                    <Table.ButtonEdit />
                  </Table.Data>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    </AdminLayout>
  );
}
