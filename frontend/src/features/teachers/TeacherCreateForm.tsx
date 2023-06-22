import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Field } from '@/shared/ui/Input';
import { SelectSubjects } from '../subjects/SelectSubjects';
import { API_TEACHERS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/Button';

export type TeachersFormCreateProps = {
  refresh: () => Promise<unknown>;
  onClose: () => void;
};

export type TeacherCreateFormData = {
  first_name: string;
  last_name: string;
  patronymic: string;
};

export function TeacherCreateForm({
  refresh,
  onClose,
}: TeachersFormCreateProps) {
  const { register, handleSubmit, formState } = useForm<TeacherCreateFormData>({
    mode: 'all',
  });
  const [subjects, setSubjects] = useState<string[]>([]);

  const onValid = async (data: TeacherCreateFormData) => {
    await createEntity(API_TEACHERS, {
      body: {
        ...data,
        subjects: subjects,
      },
    });
    onClose();
    return refresh();
  };

  const onInvalid = () => {
    console.log('error');
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <div className="px-8 pt-8">
        <h2 className="text-slate-700 dark:text-zinc-300 text-sm font-semibold mb-2">
          Добавить преподавателя
        </h2>
      </div>
      <div className="grid-cols-6 gap-y-5 gap-x-10 grid border-b border-zinc-200 dark:border-zinc-700 p-8">
        <div className="col-span-2">
          <Field label="Имя">
            <Input
              {...register('first_name', { required: true })}
              type="text"
              isValid={
                formState.touchedFields.first_name
                  ? !formState.errors.first_name
                  : null
              }
              disabled={formState.isSubmitting}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Фамилия">
            <Input
              {...register('last_name', { required: true })}
              type="text"
              isValid={
                formState.touchedFields.last_name
                  ? !formState.errors.last_name
                  : null
              }
              disabled={formState.isSubmitting}
            />
          </Field>
        </div>
        <div className="col-span-2">
          <Field label="Отчество">
            <Input
              {...register('patronymic', { required: true })}
              type="text"
              isValid={
                formState.touchedFields.patronymic
                  ? !formState.errors.patronymic
                  : null
              }
              disabled={formState.isSubmitting}
            />
          </Field>
        </div>
        <div className="col-span-3">
          <label className="text-sm text-zinc-700 block mb-1" htmlFor="">
            Предметы
          </label>
          <SelectSubjects value={subjects} onChange={setSubjects} />
        </div>
      </div>
      <div className="p-4 flex justify-end gap-5">
        <Button type="button" onClick={onClose}>
          Отменить
        </Button>
        <Button type="submit" variant="primary">
          Сохранить
        </Button>
      </div>
    </form>
  );
}
