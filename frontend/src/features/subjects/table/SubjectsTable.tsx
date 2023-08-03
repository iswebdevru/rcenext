'use client';

import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { Paginated, Subject, apiSubjects } from '@/shared/api';
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
import { InfiniteScroll } from '@/shared/ui/InfiniteScroll';
import { createInfiniteKey } from '@/shared/packages/swr';
import { useDebounce, useUpdateSearchParams } from '@/shared/hooks';
import { SubjectEditingRow } from './SubjectEditingRow';

export type SubjectsTableProps = {
  firstPage: Paginated<Subject>;
};

export function SubjectsTable({ firstPage }: SubjectsTableProps) {
  const [searchFilter, setSearchFilter] = useState('');

  const { data, setSize, mutate } = useSWRInfinite<Paginated<Subject>>(
    createInfiniteKey(firstPage.next),
  );

  useUpdateSearchParams({
    search: useDebounce(searchFilter),
  });

  const deleteSubjects = async (urls: string[]) => {
    await Promise.all(urls.map(apiSubjects.delete));
    // return mutate();
  };

  const pages = data ? [firstPage, ...data] : [firstPage];
  const isEnd = !data || !data.at(-1)?.next;

  return (
    <InfiniteScroll ignore={isEnd} onLoad={() => setSize(p => p + 1)}>
      <Table>
        <TableControls
          onDelete={deleteSubjects}
          search={searchFilter}
          onSearchChange={setSearchFilter}
        />
        <TableMain>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <TableSelectAllRowsCheckbox />
              </TableHeadCell>
              <TableHeadCell>Предмет</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody<string>
            editingRow={url => <SubjectEditingRow refresh={mutate} id={url} />}
          >
            {pages
              .flatMap(page => page.results)
              .map(subject => (
                <TableRow key={subject.url} rowId={subject.url}>
                  <TableDataCell>
                    <TableSelectRowCheckbox />
                  </TableDataCell>
                  <TableDataCell>{subject.name}</TableDataCell>
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
