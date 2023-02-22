import { ClassesTimetable, Timetable } from '@/entities/classes';
import Calendar from '@/shared/ui/calendar';
import { Search } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import Toggles, { Variant } from '@/shared/ui/toggles';
import AdminNav from '@/widgets/admin-nav';
import { useState } from 'react';

const timetableData: Timetable[] = [
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 'МАС пнг',
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
  {
    group: 'ИС-203',
    classes: [
      {
        number: 0,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 1,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 2,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
      {
        number: 3,
        subject: 'Математика',
        cabinet: 302,
        note: '3к',
        teacher: 'Кто-то',
      },
    ],
  },
];

const timetableTypes = [
  {
    id: 0,
    value: 'Основное',
  },
  {
    id: 1,
    value: 'Изменения',
  },
] as const;

const daysOfTheWeek = [
  { id: '1', value: 'Понедельник' },
  { id: '2', value: 'Вторник' },
  { id: '3', value: 'Среда' },
  { id: '4', value: 'Четверг' },
  { id: '5', value: 'Пятница' },
  { id: '6', value: 'Суббота' },
] as const;

export default function Edit() {
  const [selectedTimetableType, setTimetableType] = useState(0);
  const [date, setDate] = useState(new Date());
  const [selectedDayOfTheWeek, setSelectedDayOfTheWeek] = useState('1');

  return (
    <div className="flex h-full">
      <div className="h-full shrink-0">
        <AdminNav />
      </div>
      <div className="grow">
        <div className="h-10 bg-slate-400">общее редактирование удаление</div>
        <div className="grid grid-cols-4">
          {timetableData.map((data, i) => (
            <ClassesTimetable
              key={i}
              timetable={data}
              controlPanel={
                <div className="flex gap-2">
                  <button>Select</button>
                  <button>Edit</button>
                  <button>Del</button>
                </div>
              }
            ></ClassesTimetable>
          ))}
        </div>
      </div>
      <div className="p-2 w-80">
        <div className="mb-2">
          <Search placeholder="Группа" />
        </div>
        <div className="mb-2">
          <Toggles value={selectedTimetableType} setValue={setTimetableType}>
            {timetableTypes.map(timetableType => (
              <Variant key={timetableType.id} value={timetableType.id}>
                {timetableType.value}
              </Variant>
            ))}
          </Toggles>
        </div>
        {selectedTimetableType === 0 ? (
          <Select
            value={selectedDayOfTheWeek}
            onChange={setSelectedDayOfTheWeek}
          >
            {daysOfTheWeek.map(day => (
              <Select.Option key={day.id} value={day.id}>
                {day.value}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Calendar date={date} setDate={setDate} />
        )}
      </div>
    </div>
  );
}
