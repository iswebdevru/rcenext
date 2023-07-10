import { API_SUBJECTS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/Input';
import { useForm } from 'react-hook-form';

export type SubjectCreateFormProps = {
  refresh: () => Promise<unknown>;
  onClose: () => void;
};

export type SubjectCreateFormData = {
  subject: string;
};

export function SubjectCreateForm({
  refresh,
  onClose,
}: SubjectCreateFormProps) {
  const { register, handleSubmit } = useForm<SubjectCreateFormData>({
    mode: 'all',
  });

  const onSave = async (data: SubjectCreateFormData) => {
    await createEntity(API_SUBJECTS, {
      body: { name: data.subject },
    });
    onClose();
    return refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="max-w-lg rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/40"
    >
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-700">
        <TextField
          label="Предмет"
          placeholder="Название"
          autoComplete="off"
          type="text"
          {...register('subject', { required: true })}
        />
      </div>
      <div className="flex justify-end gap-4 p-4">
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
