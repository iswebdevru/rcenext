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
import { Overlay, Portal } from '@/shared/ui/Modal';

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
        <Portal>
          <Overlay>
            <TeachersCreator refresh={mutate} />
          </Overlay>
        </Portal>
        <Table>
          <Table.Controls
            onDelete={deleteTeachers}
            search={searchFilter}
            onSearchChange={setSearchFilter}
          />
          <Table.Main>
            <Table.Head>
              <Table.Row>
                <Table.HeadCell>
                  <Table.SelectAllRowsCheckbox />
                </Table.HeadCell>
                <Table.HeadCell>Имя</Table.HeadCell>
                <Table.HeadCell>Фамилия</Table.HeadCell>
                <Table.HeadCell>Отчество</Table.HeadCell>
                <Table.HeadCell>Предметы</Table.HeadCell>
                <Table.HeadCell />
              </Table.Row>
            </Table.Head>
            <Table.Body<string>
              updater={url => <TeachersUpdater refresh={mutate} id={url} />}
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
                    <Table.DataCell>
                      <Table.SelectRowCheckbox />
                    </Table.DataCell>
                    <Table.DataCell>{teacher.first_name}</Table.DataCell>
                    <Table.DataCell>{teacher.last_name}</Table.DataCell>
                    <Table.DataCell>{teacher.patronymic}</Table.DataCell>
                    <Table.DataCell>
                      <div className="flex flex-wrap">
                        {teacher.subjects.map(subjectUrl => (
                          <TeacherSubject key={subjectUrl} url={subjectUrl} />
                        ))}
                      </div>
                    </Table.DataCell>
                    <Table.DataCell>
                      <Table.ButtonEdit />
                    </Table.DataCell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Main>
        </Table>
      </div>
    </AdminLayout>
  );
}
