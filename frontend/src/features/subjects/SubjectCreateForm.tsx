import { API_SUBJECTS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { Field, Input } from '@/shared/ui/Input';
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
    <form onSubmit={handleSubmit(onSave)}>
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <Field label="Предмет">
          <Input type="text" {...register('subject', { required: true })} />
        </Field>
      </div>
      <div className="p-4 flex gap-4">
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
