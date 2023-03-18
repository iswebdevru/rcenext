import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { InputText } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/select';
import { displayGroupName, useGroups } from '@/entities/groups';
import { useSubjects } from '@/entities/subjects';
import { useTeachers } from '@/entities/teachers';

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

type SelectTeachersProps = {
  onChange: (ids: number[]) => void;
  value: number[];
  required: boolean;
};

function SelectTeachers(props: SelectTeachersProps) {
  const { data: teachers } = useTeachers();

  return (
    <Select multiple {...props}>
      {teachers?.map(teacher => (
        <Select.Option key={teacher.id} value={teacher.id}>
          {`${teacher.first_name[0]}. ${teacher.patronymic[0]}. ${teacher.last_name}`}
        </Select.Option>
      ))}
    </Select>
  );
}

type ClassInfo = {
  subjectId?: number;
  teachersIds: number[];
  cabinet: string;
  note: string;
};

const defaultClassesTimetable: ClassInfo[] = [
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
  {
    cabinet: '',
    note: '',
    teachersIds: [],
  },
];

export function CreateClassesTimetable() {
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>();
  const [classesTimetable, setClassesTimetable] = useState(
    defaultClassesTimetable
  );

  const updateTimetable = (i: number, info: Partial<ClassInfo>) => {
    setClassesTimetable(p => {
      const copy = [...p];
      copy[i] = {
        ...copy[i],
        ...info,
      };
      return copy;
    });
  };

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
            {classesTimetable.map((info, i) => (
              <tr key={i} className="">
                <td className="px-2 py-2 text-center w-[6%]">{i}</td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectSubject
                    value={info.subjectId}
                    onChange={subjectId => updateTimetable(i, { subjectId })}
                    required
                  />
                </td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectTeachers
                    required
                    value={info.teachersIds}
                    onChange={teachersIds =>
                      updateTimetable(i, {
                        teachersIds,
                      })
                    }
                  />
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText
                    placeholder="Кабинет"
                    value={info.cabinet}
                    onChange={e =>
                      updateTimetable(i, { cabinet: e.currentTarget.value })
                    }
                  />
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText
                    placeholder="Примечание"
                    value={info.note}
                    onChange={e => {
                      updateTimetable(i, { note: e.currentTarget.value });
                    }}
                  />
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
