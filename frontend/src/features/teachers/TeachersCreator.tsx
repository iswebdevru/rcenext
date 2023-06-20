import { useRef, useState } from 'react';
import { InputText } from '@/shared/ui/Input';
import { TableCreatorComponentProps } from '@/shared/ui/Table';
import { SelectSubjects } from '../subjects/SelectSubjects';
import { API_TEACHERS, createEntity } from '@/shared/api';
import { Button } from '@/shared/ui/Button';

export function TeachersCreator({ refresh }: TableCreatorComponentProps) {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const patronymicRef = useRef<HTMLInputElement>(null);
  const [subjects, setSubjects] = useState<string[]>([]);

  const onSave = async () => {
    await createEntity(API_TEACHERS, {
      body: {
        first_name: firstNameRef.current!.value,
        last_name: lastNameRef.current!.value,
        patronymic: patronymicRef.current!.value,
        subjects: subjects,
      },
    });
    return refresh();
  };

  return (
    <form
      onSubmit={onSave}
      className="bg-white border border-zinc-200 dark:border-zinc-700 rounded-md max-w-4xl dark:bg-zinc-800"
    >
      <div className="grid-cols-6 gap-y-5 gap-x-10 grid border-b border-zinc-200 dark:border-zinc-700 p-8 pr-28">
        <div className="col-span-2">
          <label className="text-sm text-zinc-700 block mb-1" htmlFor="">
            Имя
          </label>
          <InputText ref={firstNameRef} required />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-zinc-700 block mb-1" htmlFor="">
            Фамилия
          </label>
          <InputText ref={lastNameRef} required />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-zinc-700 block mb-1" htmlFor="">
            Отчество
          </label>
          <InputText ref={patronymicRef} required />
        </div>
        <div className="col-span-4">
          <label className="text-sm text-zinc-700 block mb-1" htmlFor="">
            Предметы
          </label>
          <SelectSubjects value={subjects} onChange={setSubjects} />
        </div>
      </div>
      <div className="p-5 flex justify-end gap-5">
        <Button type="button">Отменить</Button>
        <Button type="submit" variant="primary">
          Сохранить
        </Button>
      </div>
    </form>
  );
}
