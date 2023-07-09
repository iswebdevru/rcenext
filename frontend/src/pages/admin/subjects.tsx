import { useState } from 'react';
import Head from 'next/head';
import { SubjectCreateForm, SubjectEditingRow } from '@/features/subjects';
import { AdminLayout } from '@/layouts';
import { API_SUBJECTS, deleteEntities, Subject } from '@/shared/api';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { Button } from '@/shared/ui/Button';
import { Table } from '@/shared/ui/Table';
import { Title } from '@/shared/ui/Typography';
import { Reveal } from '@/shared/ui/Reveal';

export default function Subjects() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Subject>(
    `${API_SUBJECTS}?search=${searchFilterDebounced}`
  );

  const deleteSubjects = async (urls: string[]) => {
    await deleteEntities(urls);
    return mutate();
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
                setIsFormVisible(true);
              }}
            >
              Добавить
            </Button>
          </div>
          <Reveal isVisible={isFormVisible}>
            <div className="mb-6">
              <SubjectCreateForm
                refresh={mutate}
                onClose={() => setIsFormVisible(false)}
              />
            </div>
          </Reveal>
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
