import { useForm } from 'react-hook-form';
import { API_GROUPS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/Button';
import { Field, TextField } from '@/shared/ui/Input';

export type GroupCreateForm = {
  refresh: () => Promise<unknown>;
  onClose: () => void;
};

export type GroupCreateFormData = {
  group: string;
  main_block: string;
};

export function GroupCreateForm({ refresh, onClose }: GroupCreateForm) {
  const { register, handleSubmit } = useForm<GroupCreateFormData>({
    mode: 'all',
  });

  const onSave = async (data: GroupCreateFormData) => {
    await createEntity(API_GROUPS, {
      body: {
        name: data.group,
        main_block: parseInt(data.main_block),
      },
    });
    onClose();
    return refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-6 p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="col-span-2">
          <Field label="Группа">
            <TextField
              {...register('group', {
                required: true,
                pattern: /[А-ЯA-Z]+к?-[1-4]\d{2,}/,
              })}
            />
          </Field>
        </div>
        <div className="col-span-2 col-start-4">
          <Field label="Корпус">
            <TextField
              {...register('main_block', { required: true, pattern: /\d+/ })}
            />
          </Field>
        </div>
      </div>
      <div className="p-4 flex justify-end gap-5">
        <Button onClick={onClose}>Отменить</Button>
        <Button variant="primary">Сохранить</Button>
      </div>
    </form>
  );
}
