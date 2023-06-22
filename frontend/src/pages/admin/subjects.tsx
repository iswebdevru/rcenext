import { useState } from 'react';
import Head from 'next/head';
import { SubjectCreateForm, SubjectEditingRow } from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';
import {
  Modal,
  Overlay,
  useModalTransition,
  useOverlayTransition,
} from '@/shared/ui/Modal';
import { Portal } from '@/shared/ui/Portal';
import { Table } from '@/shared/ui/Table';
import { Title } from '@/shared/ui/Typography';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');
  const [{ status: overlayStatus }, toggleOverlay] = useOverlayTransition();
  const [{ status: modalStatus }, toggleModal] = useModalTransition();
  const searchFilterDebounced = useDebounce(searchFilter);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Subject>(
    `${API_SUBJECTS}?search=${searchFilterDebounced}`
  );

  const deleteSubjects = async (urls: string[]) => {
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
        <title>Предметы</title>
      </Head>
      <AdminLayout>
        <div className="h-full p-6">
          <div className="flex justify-between items-center px-6 pb-6">
            <Title>Предметы</Title>
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
                  <SubjectCreateForm refresh={mutate} onClose={closeModal} />
                </Modal>
              </Overlay>
            </Portal>
          </div>
          <Table>
            <Table.Controls
              onDelete={deleteSubjects}
              search={searchFilter}
              onSearchChange={setSearchFilter}
            />
            <Table.Main>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>
                    <Table.SelectAllRowsCheckbox />
                  </Table.HeadCell>
                  <Table.HeadCell>Предмет</Table.HeadCell>
                  <Table.HeadCell />
                </Table.Row>
              </Table.Head>
              <Table.Body<string>
                editingRow={url => (
                  <SubjectEditingRow refresh={mutate} id={url} />
                )}
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
            </Table.Main>
          </Table>
        </div>
      </AdminLayout>
    </>
  );
}
