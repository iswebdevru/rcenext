'use client';
import useSWRInfinite from 'swr/infinite';
import { Group, Paginated, apiGroups } from '@/shared/api';
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
import { createInfiniteKey } from '@/shared/packages/swr';
import { InfiniteScroll } from '@/shared/ui/InfiniteScroll';
import { useDebounce, useUpdateSearchParams } from '@/shared/hooks';
import { useState } from 'react';
import GroupEditingRow from './GroupEditingRow';

export type GroupsTableProps = {
  firstPage: Paginated<Group>;
};

export function GroupsTable({ firstPage }: GroupsTableProps) {
  const [searchFilter, setSearchFilter] = useState('');

  const { data, mutate, setSize } = useSWRInfinite<Paginated<Group>>(
    createInfiniteKey(firstPage.next),
  );

  useUpdateSearchParams({
    search: useDebounce(searchFilter),
  });

  const deleteGroups = async (urls: string[]) => {
    await Promise.all(urls.map(apiGroups.delete));
    return mutate();
  };

  const pages = data ? [firstPage, ...data] : [firstPage];
  const isEnd = !data || !data.at(-1)?.next;

  return (
    <InfiniteScroll ignore={isEnd} onLoad={() => setSize(p => p + 1)}>
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
            {pages
              ?.flatMap(page => page.results)
              .map(group => (
                <TableRow key={group.url} rowId={group.url}>
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
    </InfiniteScroll>
  );
}
