import { ClassesTimetable, Timetable } from '@/entities/classes';
import { BaseLayout } from '@/layouts';
import { HUMAN_MONTHS } from '@/shared/constants';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Sidebar } from '@/shared/ui/Sidebar';
import { Toggles } from '@/shared/ui/Toggles';
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

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [opened, setOpened] = useState(false);
  const [blockType, setBlockType] = useState<'all' | '1-5' | '6'>('all');
  const [withChanges, setWithChanges] = useState(true);

  return (
    <BaseLayout>
      <div className="container flex gap-4 pt-6">
        <div className="grow">
          <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
            Расписание занятий на {date.getDate()}{' '}
            {HUMAN_MONTHS[date.getMonth()]}
          </h1>
          <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
            1 корпус
          </h2>
          <div className="grid justify-between grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {timetableData.map((timetable, i) => (
              <ClassesTimetable key={i} timetable={timetable} />
            ))}
          </div>
          <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
            6 корпус
          </h2>
          <div className="grid justify-between grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {timetableData.map((timetable, i) => (
              <ClassesTimetable key={i} timetable={timetable} />
            ))}
          </div>
          {/* <button onClick={() => setOpened(p => !p)}>oopene</button> */}
        </div>
        <div className="flex-shrink-0">
          <Sidebar opened={opened}>
            <div className="h-full">
              <div className="mb-3">
                <Calendar date={date} setDate={setDate} />
              </div>
              <div className="mb-3">
                <Toggles value={blockType} setValue={setBlockType}>
                  <Toggles.Variant value="all">Все</Toggles.Variant>
                  <Toggles.Variant value="1-5">1-5</Toggles.Variant>
                  <Toggles.Variant value="6">6</Toggles.Variant>
                </Toggles>
              </div>
              <div className="mb-3">
                <Toggles value={withChanges} setValue={setWithChanges}>
                  <Toggles.Variant value={false}>Основное</Toggles.Variant>
                  <Toggles.Variant value={true}>С изменениями</Toggles.Variant>
                </Toggles>
              </div>
              <InputSearch placeholder="Группа" />
            </div>
          </Sidebar>
        </div>
      </div>
    </BaseLayout>
  );
}
