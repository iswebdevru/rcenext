import { AdminLayout } from '@/layouts';
import { Table } from '@/shared/ui/Table';
import {
  TeachersCreator,
  TeachersTableRowPlaceholder,
  TeacherSubject,
  TeachersUpdater,
} from '@/features/teachers';
import { usePaginatedFetch } from '@/shared/hooks';
import { API_TEACHERS, fetcher, Teacher } from '@/shared/api';

export default function Teachers() {
  const { data, lastElementRef, mutate } =
    usePaginatedFetch<Teacher>(API_TEACHERS);

  const deleteTeachers = async (urls: string[]) => {
    await Promise.all(urls.map(url => fetcher.delete(url)));
    mutate();
  };

  return (
    <AdminLayout>
      <div className="h-full p-6">
        <Table<string>
          onDelete={deleteTeachers}
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
          loader={<TeachersTableRowPlaceholder />}
        >
          {data
            ?.map(page => page.results)
            .flat()
            .map((teacher, i, a) => (
              <Table.RowWithId
                key={teacher.url}
                id={teacher.url}
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
              </Table.RowWithId>
            ))}
        </Table>
      </div>
    </AdminLayout>
  );
}
