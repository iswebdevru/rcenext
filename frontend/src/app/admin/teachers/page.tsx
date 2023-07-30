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
import { Button } from '@/shared/ui/Controls/Button';
import { Title } from '@/shared/ui/Typography';
import { useDebounce, usePaginatedFetch } from '@/shared/hooks';
import { API_TEACHERS, Teacher, apiTeachers } from '@/shared/api';
import { ListInLine, ListInLineItem } from '@/shared/ui/ListInLine';
import { SubjectTextView } from '@/entities/subjects';
import { TeacherEditingRow, TeacherCreateForm } from '@/features/teachers';
import { Reveal } from '@/shared/ui/Utils/Reveal';
import { useNotification, Notification } from '@/shared/ui/Notification';

export default function Page() {
  const [searchFilter, setSearchFilter] = useState('');
  const searchFilterDebounced = useDebounce(searchFilter);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { data, lastElementRef, mutate } = usePaginatedFetch<Teacher>(
    `${API_TEACHERS}?search=${searchFilterDebounced}`,
  );

  const notify = useNotification();

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

  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between px-6 pb-6">
        <Title>Преподаватели</Title>
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
          <TeacherCreateForm
            refresh={mutate}
            onClose={() => setIsFormVisible(false)}
          />
        </div>
      </Reveal>
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
            {data
              ?.flatMap(page => page.results)
              .map((teacher, i, a) => (
                <TableRow
                  key={teacher.url}
                  rowId={teacher.url}
                  ref={a.length === i + 1 ? lastElementRef : null}
                >
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
          </TableBody>
        </TableMain>
      </Table>
    </div>
  );
}

export const metadata = {
  title: 'Преподаватели',
};
