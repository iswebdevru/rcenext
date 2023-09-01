'use client';

import { useForm } from 'react-hook-form';
import { apiGroups } from '@/shared/api';
import { Button } from '@/shared/ui/Controls/Button';
import { TextField } from '@/shared/ui/Controls';
import { Reveal } from '@/shared/ui/Utils';
import { useGroupsCreateFormIsOpen } from './store';
import { useRouter } from 'next/navigation';

type GroupCreateFormData = {
  group: string;
  main_block: string;
};

export function GroupCreateForm() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<GroupCreateFormData>({
    mode: 'all',
  });

  const { isOpened, toggle } = useGroupsCreateFormIsOpen();

  const onSave = async (data: GroupCreateFormData) => {
    await apiGroups.create({
      name: data.group,
      main_block: parseInt(data.main_block),
    });
    reset();
    router.refresh();
  };

  return (
    <Reveal isVisible={isOpened}>
      <div className="mb-6">
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
      </div>
    </Reveal>
  );
}
