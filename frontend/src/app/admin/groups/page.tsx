'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableButtonEdit,
  TableControls,
  TableDataCell,
  TableHead,
  TableHeadCell,
  TableMain,
  TableRow,
  TableSelectAllRowsCheckbox,
  TableSelectRowCheckbox,
} from '@/shared/ui/Table';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
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
        <TableControls
          onDelete={deleteGroups}
          search={searchFilter}
          onSearchChange={setSearchFilter}
        />
        <TableMain>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <TableSelectAllRowsCheckbox />
              </TableHeadCell>
              <TableHeadCell>Группа</TableHeadCell>
              <TableHeadCell>Корпус</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody<string>
            editingRow={url => <GroupEditingRow refresh={mutate} id={url} />}
          >
            {data
              ?.flatMap(page => page.results)
              .map((group, i, a) => (
                <TableRow
                  ref={a.length === i + 1 ? lastElementRef : null}
                  key={group.url}
                  rowId={group.url}
                >
                  <TableDataCell>
                    <TableSelectRowCheckbox />
                  </TableDataCell>
                  <TableDataCell>{group.name}</TableDataCell>
                  <TableDataCell>{group.main_block}</TableDataCell>
                  <TableDataCell>
                    <TableButtonEdit />
                  </TableDataCell>
                </TableRow>
              ))}
          </TableBody>
        </TableMain>
      </Table>
    </div>
  );
}

export const metadata = {
  title: 'Группы',
};
