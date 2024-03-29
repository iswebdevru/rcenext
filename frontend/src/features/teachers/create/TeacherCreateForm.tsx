'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@/shared/ui/Controls';
import { Hyperlink, apiTeachers } from '@/shared/api';
import { SubjectsSelect } from '../../../entities/subjects/ui/SubjectsSelect';
import { Notification, useNotification } from '@/shared/ui/Notification';
import { getFieldError } from '@/shared/lib/errors';
import { useTeacherCreateFormIsOpen } from './store';
import { Reveal } from '@/shared/ui/Utils';
import { useRouter } from 'next/navigation';

export type TeacherCreateFormData = {
  first_name: string;
  last_name: string;
  patronymic: string;
};

export function TeacherCreateForm() {
  const router = useRouter();
  const { register, handleSubmit, formState, reset } =
    useForm<TeacherCreateFormData>({
      mode: 'all',
    });
  const [subjects, setSubjects] = useState(new Set<Hyperlink>());

  const notify = useNotification();

  const { isOpened, toggle } = useTeacherCreateFormIsOpen();

  const onValid = async (data: TeacherCreateFormData) => {
    try {
      const teacher = await apiTeachers.create({
        ...data,
        subjects: Array.from(subjects),
      });
      reset();
      setSubjects(new Set());
      notify(
        <Notification variant="success">
          <Notification.Title>Сохранено</Notification.Title>
          <Notification.Message>
            Преподаватель {teacher.last_name} {teacher.first_name[0]}.{' '}
            {teacher.patronymic[0]}. успешно добавлен
          </Notification.Message>
        </Notification>,
      );
      router.refresh();
    } catch {
      notify(
        <Notification variant="danger">
          <Notification.Title>Ошибка сохранения</Notification.Title>
          <Notification.Message>
            Не удалось сохранить запись о преподавателе
          </Notification.Message>
        </Notification>,
      );
    }
  };

  return (
    <Reveal isVisible={isOpened}>
      <form
        onSubmit={handleSubmit(onValid)}
        className="mb-3 max-w-4xl rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
      >
        <div className="grid grid-cols-6 gap-x-10 gap-y-5 border-b border-zinc-200 p-8 dark:border-zinc-700">
          <div className="col-span-2">
            <TextField
              label="Имя"
              placeholder="Иван"
              autoComplete="given-name"
              type="text"
              error={
                formState.errors.first_name
                  ? getFieldError(formState.errors.first_name)
                  : undefined
              }
              disabled={formState.isSubmitting}
              {...register('first_name', { required: true })}
            />
          </div>
          <div className="col-span-2">
            <TextField
              label="Фамилия"
              placeholder="Иванов"
              autoComplete="family-name"
              type="text"
              error={
                formState.errors.last_name
                  ? getFieldError(formState.errors.last_name)
                  : undefined
              }
              disabled={formState.isSubmitting}
              {...register('last_name', { required: true })}
            />
          </div>
          <div className="col-span-2">
            <TextField
              label="Отчество"
              placeholder="Иванович"
              autoComplete="additional-name"
              type="text"
              error={
                formState.errors.patronymic
                  ? getFieldError(formState.errors.patronymic)
                  : undefined
              }
              disabled={formState.isSubmitting}
              {...register('patronymic', { required: true })}
            />
          </div>
          <div className="col-span-3">
            <label className="mb-1 block text-sm text-zinc-700" htmlFor="">
              Предметы
            </label>
            <SubjectsSelect
              selectedSubjects={subjects}
              onChange={setSubjects}
            />
          </div>
        </div>
        <div className="flex justify-end gap-5 p-4">
          <div>
            <Button type="button" onClick={() => toggle(false)}>
              Закрыть
            </Button>
          </div>
          <div>
            <Button type="submit" variant="primary">
              Сохранить
            </Button>
          </div>
        </div>
      </form>
    </Reveal>
  );
}
