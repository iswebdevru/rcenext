import { SubjectsCreator, SubjectsUpdater } from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';
import { Overlay, Portal } from '@/shared/ui/Modal';
import { Table } from '@/shared/ui/Table';
import { Title } from '@/shared/ui/Typography';
import { useState } from 'react';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
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
        <div className="flex justify-between items-center px-6 pb-6">
          <Title>Предметы</Title>
          <Button
            type="button"
            variant="primary"
            onClick={() => setIsModalVisible(true)}
          >
            Добавить
          </Button>
          <Portal>
            <Overlay isVisible={isModalVisible}>
              <SubjectsCreator
                refresh={mutate}
                // onClose={() => setIsModalVisible(false)}
              />
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
              updater={url => <SubjectsUpdater refresh={mutate} id={url} />}
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
  );
}
