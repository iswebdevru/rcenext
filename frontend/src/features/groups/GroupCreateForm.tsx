import { useForm } from 'react-hook-form';
import { API_GROUPS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/controls/Button';
import { TextField } from '@/shared/ui/controls';

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
    <form
      onSubmit={handleSubmit(onSave)}
      className="max-w-2xl rounded-md border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="grid grid-cols-4 gap-8 border-b border-zinc-200 p-6 dark:border-zinc-700">
        <div className="col-span-2">
          <TextField
            label="Группа"
            placeholder="Название"
            {...register('group', {
              required: true,
              pattern: /[А-ЯA-Z]+к?-[1-4]\d{2,}/,
            })}
          />
        </div>
        <div className="col-span-2">
          <TextField
            label="Блок"
            placeholder="Номер"
            {...register('main_block', { required: true, pattern: /\d+/ })}
          />
        </div>
      </div>
      <div className="flex justify-end gap-4 px-6 py-4">
        <Button onClick={onClose}>Отменить</Button>
        <Button variant="primary">Сохранить</Button>
      </div>
    </form>
  );
}
