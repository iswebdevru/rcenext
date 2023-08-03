'use client';

import { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { useDebounce, useUpdateSearchParams } from '@/shared/hooks';
import { Paginated, Teacher, apiTeachers } from '@/shared/api';
import { ListInLine, ListInLineItem } from '@/shared/ui/ListInLine';
import { useNotification, Notification } from '@/shared/ui/Notification';
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
import { SubjectTextView } from '@/entities/subjects';
import { TeacherEditingRow } from './TeacherEditingRow';
import { LoaderCircle } from '@/shared/ui/Loader';

export type TeachersTableProps = {
  firstPage: Paginated<Teacher>;
};

export function TeachersTable({ firstPage }: TeachersTableProps) {
  const [searchFilter, setSearchFilter] = useState('');

  const notify = useNotification();

  const { data, isValidating, setSize, mutate } = useSWRInfinite<
    Paginated<Teacher>
  >(createInfiniteKey(firstPage.next));

  const deleteTeachers = async (urls: string[]) => {
    try {
      await Promise.all(urls.map(apiTeachers.delete));
      notify(
        <Notification variant="success">
          <Notification.Title>Удалено</Notification.Title>
          <Notification.Message>
            Успешно удалено {urls.length} преподавателей
          </Notification.Message>
        </Notification>,
      );
      return mutate();
    } catch (e) {
      notify(
        <Notification variant="danger">
          <Notification.Title>Ошибка</Notification.Title>
          <Notification.Message>
            Не удалось удалить записи о преподавателях
          </Notification.Message>
        </Notification>,
      );
    }
  };

  useUpdateSearchParams({
    search: useDebounce(searchFilter),
  });

  const pages = data ? [firstPage, ...data] : [firstPage];
  const isEnd = !data || !data.at(-1)?.next;

  return (
    <InfiniteScroll ignore={isEnd} onLoad={() => setSize(p => p + 1)}>
      <Table>
        <TableControls
          onDelete={deleteTeachers}
          search={searchFilter}
          onSearchChange={setSearchFilter}
        />
        <TableMain>
          <TableHead>
            <TableRow>
              <TableHeadCell>
                <TableSelectAllRowsCheckbox />
              </TableHeadCell>
              <TableHeadCell>Имя</TableHeadCell>
              <TableHeadCell>Фамилия</TableHeadCell>
              <TableHeadCell>Отчество</TableHeadCell>
              <TableHeadCell>Предметы</TableHeadCell>
              <TableHeadCell />
            </TableRow>
          </TableHead>
          <TableBody<string>
            editingRow={url => <TeacherEditingRow refresh={mutate} id={url} />}
          >
            {pages
              ?.flatMap(page => page.results)
              .map(teacher => (
                <TableRow key={teacher.url} rowId={teacher.url}>
                  <TableDataCell>
                    <TableSelectRowCheckbox />
                  </TableDataCell>
                  <TableDataCell>{teacher.first_name}</TableDataCell>
                  <TableDataCell>{teacher.last_name}</TableDataCell>
                  <TableDataCell>{teacher.patronymic}</TableDataCell>
                  <TableDataCell>
                    <ListInLine>
                      {teacher.subjects.map(subjectUrl => (
                        <ListInLineItem key={subjectUrl}>
                          <SubjectTextView url={subjectUrl} />
                        </ListInLineItem>
                      ))}
                    </ListInLine>
                  </TableDataCell>
                  <TableDataCell>
                    <TableButtonEdit />
                  </TableDataCell>
                </TableRow>
              ))}
            {isValidating ? (
              <TableRow>
                <TableDataCell colSpan={6}>
                  <div className="grid w-full place-items-center">
                    <LoaderCircle />
                  </div>
                </TableDataCell>
              </TableRow>
            ) : null}
          </TableBody>
        </TableMain>
      </Table>
    </InfiniteScroll>
  );
}
