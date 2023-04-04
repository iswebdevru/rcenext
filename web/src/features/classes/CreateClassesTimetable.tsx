import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { InputText } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/select';
import { displayGroupName } from '@/entities/groups';
import { usePaginatedFetch } from '@/shared/hooks';
import {
  API_GROUPS,
  API_SUBJECTS,
  API_TEACHERS,
  Group,
  Subject,
  Teacher,
} from '@/shared/api';

type SelectGroupProps = {
  value?: number;
  onChange: (value: number) => void;
  required: boolean;
};

function SelectGroup(props: SelectGroupProps) {
  const { data: groups, lastElementRef } = usePaginatedFetch<Group>(API_GROUPS);
  return (
    <Select {...props}>
      {groups
        ?.map(page => page.results)
        .flat()
        .map(group => (
          <Select.Option key={group.url} value={group.url} ref={lastElementRef}>
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
  const { data: subjects, lastElementRef } =
    usePaginatedFetch<Subject>(API_SUBJECTS);

  return (
    <Select {...props}>
      {subjects
        ?.map(page => page.results)
        .flat()
        .map(subject => (
          <Select.Option
            key={subject.url}
            value={subject.url}
            ref={lastElementRef}
          >
            {subject.name}
          </Select.Option>
        ))}
    </Select>
  );
}

type SelectTeachersProps = {
  onChange: (ids: string[]) => void;
  value: string[];
  required: boolean;
};

function SelectTeachers(props: SelectTeachersProps) {
  const { data: teachers, lastElementRef } =
    usePaginatedFetch<Teacher>(API_TEACHERS);

  return (
    <Select<string> multiple {...props}>
      {teachers
        ?.map(page => page.results)
        .flat()
        .map(teacher => (
          <Select.Option
            key={teacher.url}
            value={teacher.url}
            ref={lastElementRef}
          >
            {`${teacher.first_name[0]}. ${teacher.patronymic[0]}. ${teacher.last_name}`}
          </Select.Option>
        ))}
    </Select>
  );
}

type ClassInfo = {
  subjectUrl?: number;
  teachersUrls: string[];
  cabinet: string;
  note: string;
};

const defaultClassesTimetable: ClassInfo[] = [
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
  },
  {
    cabinet: '',
    note: '',
    teachersUrls: [],
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
                    value={info.subjectUrl}
                    onChange={subjectId =>
                      updateTimetable(i, { subjectUrl: subjectId })
                    }
                    required
                  />
                </td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectTeachers
                    required
                    value={info.teachersUrls}
                    onChange={teachersIds =>
                      updateTimetable(i, {
                        teachersUrls: teachersIds,
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
