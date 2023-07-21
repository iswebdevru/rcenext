import { useState } from 'react';
import Head from 'next/head';
import { Table } from '@/shared/ui/Table';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { AdminLayout } from '@/layouts';
import { GroupCreateForm } from '@/features/groups';
import GroupEditingRow from '@/features/groups/GroupEditingRow';
import { API_GROUPS, Group, apiGroups } from '@/shared/api';
import { Title } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Controls';
import { Reveal } from '@/shared/ui/Utils';

export default function Groups() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounce = useDebounce(searchFilter);

  const [isFormVisible, setIsFormVisible] = useState(false);

  const { data, lastElementRef, mutate } = usePaginatedFetch<Group>(
    `${API_GROUPS}?search=${searchFilterDebounce}`,
  );

  const deleteGroups = async (urls: string[]) => {
    await Promise.all(urls.map(apiGroups.delete));
    return mutate();
  };

  const closeModal = () => {
    setIsFormVisible(false);
  };

  return (
    <>
      <Head>
        <title>Группы</title>
      </Head>
      <AdminLayout>
        <div className="h-full p-6">
          <div className="flex items-center justify-between px-6 pb-6">
            <Title>Группы</Title>
            <div>
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
          </div>
          <Reveal isVisible={isFormVisible}>
            <div className="mb-6">
              <GroupCreateForm refresh={mutate} onClose={closeModal} />
            </div>
          </Reveal>
          <Table<string>>
            <Table.Controls
              onDelete={deleteGroups}
              search={searchFilter}
              onSearchChange={setSearchFilter}
            />
            <Table.Main>
              <Table.Head>
                <Table.Row>
                  <Table.HeadCell>
                    <Table.SelectAllRowsCheckbox />
                  </Table.HeadCell>
                  <Table.HeadCell>Группа</Table.HeadCell>
                  <Table.HeadCell>Корпус</Table.HeadCell>
                  <Table.HeadCell />
                </Table.Row>
              </Table.Head>
              <Table.Body<string>
                editingRow={url => (
                  <GroupEditingRow refresh={mutate} id={url} />
                )}
              >
                {data
                  ?.flatMap(page => page.results)
                  .map((group, i, a) => (
                    <Table.Row
                      ref={a.length === i + 1 ? lastElementRef : null}
                      key={group.url}
                      rowId={group.url}
                    >
                      <Table.DataCell>
                        <Table.SelectRowCheckbox />
                      </Table.DataCell>
                      <Table.DataCell>{group.name}</Table.DataCell>
                      <Table.DataCell>{group.main_block}</Table.DataCell>
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
