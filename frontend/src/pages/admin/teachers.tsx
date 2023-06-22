import { useState } from 'react';
import Head from 'next/head';
import { Table } from '@/shared/ui/Table';
import { Button } from '@/shared/ui/Button';
import {
  Modal,
  Overlay,
  useModalTransition,
  useOverlayTransition,
} from '@/shared/ui/Modal';
import { Title } from '@/shared/ui/Typography';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { API_TEACHERS, deleteEntities, Teacher } from '@/shared/api';
import { Portal } from '@/shared/ui/Portal';
import { ListInLine } from '@/shared/ui/ListInLine';
import { SubjectTextView } from '@/entities/subjects';
import { TeacherEditingRow, TeacherCreateForm } from '@/features/teachers';
import { AdminLayout } from '@/layouts';

export default function Teachers() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const [{ status: overlayStatus }, toggleOverlay] = useOverlayTransition();
  const [{ status: modalStatus }, toggleModal] = useModalTransition();
  const { data, lastElementRef, mutate } = usePaginatedFetch<Teacher>(
    `${API_TEACHERS}?search=${searchFilterDebounced}`
  );

  const deleteTeachers = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
  };

  const closeModal = () => {
    toggleOverlay(false);
    toggleModal(false);
  };

  return (
    <>
      <Head>
        <title>Преподаватели</title>
      </Head>
      <AdminLayout>
        <div className="h-full p-6">
          <div className="flex justify-between items-center px-6 pb-6">
            <Title>Преподаватели</Title>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                toggleOverlay(true);
                toggleModal(true);
              }}
            >
              Добавить
            </Button>
            <Portal>
              <Overlay status={overlayStatus} onClose={closeModal}>
                <Modal status={modalStatus}>
                  <TeacherCreateForm refresh={mutate} onClose={closeModal} />
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
                editingRow={url => (
                  <TeacherEditingRow refresh={mutate} id={url} />
                )}
              >
                {data
                  ?.flatMap(page => page.results)
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
                        <ListInLine>
                          {teacher.subjects.map(subjectUrl => (
                            <ListInLine.Item key={subjectUrl}>
                              <SubjectTextView url={subjectUrl} />
                            </ListInLine.Item>
                          ))}
                        </ListInLine>
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
    </>
  );
}
