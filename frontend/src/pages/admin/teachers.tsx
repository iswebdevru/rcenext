import { useState } from 'react';
import { Table } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import { Modal, Overlay } from '@/shared/ui/Modal';
import { Title } from '@/shared/ui/Typography';
import {
  useAnimationTransition,
  useDebounce,
  usePaginatedFetch,
} from '@/shared/hooks';
import { API_TEACHERS, deleteEntities, Teacher } from '@/shared/api';
import {
  TeacherSubject,
  TeachersUpdater,
  TeacherCreateForm,
} from '@/features/teachers';
import { AdminLayout } from '@/layouts';
import { Portal } from '@/shared/ui/Portal';

export default function Teachers() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const [{ status: modalStatus }, toggleModal] = useAnimationTransition();
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
        <div className="flex justify-between items-center px-6 pb-6">
          <Title>Преподаватели</Title>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              toggleModal(true);
            }}
          >
            Добавить
          </Button>
          <Portal>
            <Overlay status={modalStatus}>
              <Modal status={modalStatus}>
                <TeacherCreateForm
                  refresh={mutate}
                  onClose={() => {
                    toggleModal(false);
                  }}
                />
              </Modal>
            </Overlay>
          </Portal>
        </div>
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
