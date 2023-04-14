import { FormEventHandler, useState } from 'react';
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
  ClassesSchedulePeriod,
} from '@/shared/api';

type SelectGroupProps = {
  value?: string;
  onChange: (value: string) => void;
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
  value?: string;
  onChange: (value: string) => void;
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

const defaultClassesTimetable: ClassesSchedulePeriod[] = [
  {
    index: 0,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 1,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 2,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 3,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 4,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 5,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 6,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
  {
    index: 7,
    cabinet: '',
    note: '',
    teachers: [],
    subject: '',
  },
];

export type CreateClassesScheduleProps = {
  onSubmit: (classesSchedule: {
    group: string;
    periods: ClassesSchedulePeriod[];
  }) => void;
};

export function ClassesScheduleCreate({
  onSubmit: userOnSubmit,
}: CreateClassesScheduleProps) {
  const [group, setGroup] = useState<string | undefined>();
  const [periods, setPeriods] = useState(defaultClassesTimetable);

  const updatePeriods = (i: number, info: Partial<ClassesSchedulePeriod>) => {
    setPeriods(p => {
      const copy = [...p];
      copy[i] = {
        ...copy[i],
        ...info,
      };
      return copy;
    });
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    userOnSubmit({
      group: group as string,
      periods: periods.filter(
        period => period.subject && period.cabinet && period.teachers.length
      ),
    });
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col items-start">
          <label className="mb-2 text-neutral-600">Группа:</label>
          <SelectGroup value={group} onChange={setGroup} required />
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
            {periods.map(period => (
              <tr key={period.index} className="">
                <td className="px-2 py-2 text-center w-[6%]">{period.index}</td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectSubject
                    value={period.subject}
                    onChange={subject =>
                      updatePeriods(period.index, { subject })
                    }
                    required
                  />
                </td>
                <td className="px-2 py-2 w-[32%]">
                  <SelectTeachers
                    required
                    value={period.teachers}
                    onChange={teachers =>
                      updatePeriods(period.index, {
                        teachers,
                      })
                    }
                  />
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText
                    placeholder="Кабинет"
                    value={period.cabinet}
                    onChange={e =>
                      updatePeriods(period.index, {
                        cabinet: e.currentTarget.value,
                      })
                    }
                  />
                </td>
                <td className="w-[15%] px-2 py-2 ">
                  <InputText
                    placeholder="Примечание"
                    value={period.note}
                    onChange={e => {
                      updatePeriods(period.index, {
                        note: e.currentTarget.value,
                      });
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
