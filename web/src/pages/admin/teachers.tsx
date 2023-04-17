import { AdminLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';
import {
  TeachersCreator,
  TeacherSubject,
  TeachersUpdater,
} from '@/features/teachers';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_TEACHERS, deleteEntities, Teacher } from '@/shared/api';
import { useState } from 'react';
import { LoaderWrapper } from '@/shared/ui/LoaderWrapper';
import { useNotificationEmitter } from '@/shared/ui/Notification';

export default function Teachers() {
  const [searchFilter, setSearchFilter] = useState('');
  const { data, lastElementRef, isValidating, mutate } =
    usePaginatedFetch<Teacher>(`${API_TEACHERS}?search=${searchFilter}`);

  const notify = useNotificationEmitter();

  const deleteTeachers = async (urls: string[]) => {
    await deleteEntities(urls);
    notify({
      kind: 'success',
      text: `Удалено ${urls.length} пользователей`,
    });
    return mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table>
          <Table.Header
            onDelete={deleteTeachers}
            onSearchChange={e => setSearchFilter(e.target.value)}
          />
          <LoaderWrapper enabled={isValidating}>
            <Table.Body<string>
              creator={() => <TeachersCreator refresh={mutate} />}
              updater={url => <TeachersUpdater refresh={mutate} id={url} />}
              header={
                <Table.Row>
                  <Table.SelectAllRowsCheckbox />
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
                    <Table.SelectRowCheckbox />
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
