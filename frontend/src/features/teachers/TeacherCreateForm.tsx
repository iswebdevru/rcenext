import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button } from '@/shared/ui/controls';
import { API_TEACHERS, createEntity } from '@/shared/api';
import { SelectSubjects } from '../subjects/SelectSubjects';

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
    <form
      onSubmit={handleSubmit(onValid, onInvalid)}
      className="max-w-4xl rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="grid grid-cols-6 gap-x-10 gap-y-5 border-b border-zinc-200 p-8 dark:border-zinc-700">
        <div className="col-span-2">
          <TextField
            label="Имя"
            placeholder="Иван"
            autoComplete="given-name"
            type="text"
            error={formState.errors.first_name?.message}
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
            error={formState.errors.last_name?.message}
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
            error={formState.errors.patronymic?.message}
            disabled={formState.isSubmitting}
            {...register('patronymic', { required: true })}
          />
        </div>
        <div className="col-span-3">
          <label className="mb-1 block text-sm text-zinc-700" htmlFor="">
            Предметы
          </label>
          <SelectSubjects value={subjects} onChange={setSubjects} />
        </div>
      </div>
      <div className="flex justify-end gap-5 p-4">
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
