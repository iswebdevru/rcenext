import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { InputText } from '@/shared/ui/Input';
import { Select, SelectProps } from '@/shared/ui/select';
import { displayGroupName, useGroups } from '@/entities/groups';
import { useSubjects } from '@/entities/subjects';

type SelectGroupProps = {
  value?: number;
  onChange: (value: number) => void;
  required: boolean;
};

function SelectGroup(props: SelectGroupProps) {
  const { data: groups } = useGroups();
  return (
    <Select {...props}>
      {groups?.map(group => (
        <Select.Option key={group.id} value={group.id}>
          {displayGroupName(group)}
        </Select.Option>
      ))}
    </Select>
  );
}

type SelectSubjectProps = {
  value?: number;
  onChange: (value: number) => void;
  required: boolean;
};

function SelectSubject(props: SelectSubjectProps) {
  const { data: subjects } = useSubjects();

  return (
    <Select {...props}>
      {subjects?.map(subject => (
        <Select.Option key={subject.id} value={subject.id}>
          {subject.name}
        </Select.Option>
      ))}
    </Select>
  );
}

export function CreateClassesTimetable() {
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>();

  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <form>
        <div className="flex flex-col items-start">
          <label className="mb-2 text-neutral-600">Группа:</label>
          <SelectGroup
            value={selectedGroup}
            onChange={setSelectedGroup}
            required
          />
        </div>
        <table className="mb-4">
          <tbody>
            <tr>
              <th className="p-2 font-semibold text-neutral-800 w-[6%]">№</th>
              <th className="p-2 font-semibold text-left text-neutral-800 w-[32%]">
                Предмет
              </th>
              <th className="p-2 font-semibold text-left text-neutral-800 w-[32%]">
                Преподаватель
              </th>
              <th className="p-2 font-semibold text-left text-neutral-800 w-[15%]">
                Кабинет
              </th>
              <th className="p-2 font-semibold text-left text-neutral-800 w-[15%]">
                Примечание
              </th>
            </tr>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <tr key={i} className="opacity-50 focus-within:opacity-100">
                <td className="px-2 py-2 text-center w-[6%]">{i}</td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectSubject
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    required
                  />
                </td>
                <td className="px-2 py-2 w-[32%]">
                  <Select
                    required
                    searchString="asdf"
                    onSearchStringChange={() => {}}
                    onChange={() => {}}
                  ></Select>
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText placeholder="Кабинет" />
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText placeholder="Примечание" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex">
          <Button type="button">Загрузить из основного</Button>
          <Button type="button" className="ml-auto mr-2">
            Отменить
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </div>
  );
}
