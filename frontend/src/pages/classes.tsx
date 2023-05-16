import { useState } from 'react';
import { HUMAN_MONTHS } from '@/shared/constants';
import { getWeekType, WEEKDAYS_MAP } from '@/shared/lib/date';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Sidebar } from '@/shared/ui/Sidebar';
import { Toggles } from '@/shared/ui/Toggles';
import { BaseLayout } from '@/layouts';
import { CollegeBlock, CollegeBlockToggles } from '@/entities/classes';
import { ClassesScheduleGrid } from '@/widgets/classes';

export default function Classes() {
  const [date, setDate] = useState(new Date());
  // const [opened, setOpened] = useState(false);
  const [collegeBlock, setCollegeBlock] = useState<CollegeBlock>(-1);
  const [isMixed, setIsMixed] = useState(true);
  const [groupSearch, setGroupSearch] = useState('');

  const weekType = getWeekType(date);

  return (
    <BaseLayout>
      <div className="container flex gap-4 pt-6">
        <div className="grow">
          <h1 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-200">
            Расписание занятий на {date.getDate()}{' '}
            {HUMAN_MONTHS[date.getMonth()]} (
            {weekType === 'ЧИСЛ' ? 'Числитель' : 'Знаменатель'})
          </h1>
          {collegeBlock === -1 || collegeBlock === 1 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                1-5 корпус
              </h2>
              <ClassesScheduleGrid
                kind={isMixed ? 'mixed' : 'main'}
                collegeBlock={1}
                date={date}
                weekDay={WEEKDAYS_MAP[date.getDay()]}
                weekType={weekType}
              />
            </>
          ) : null}
          {collegeBlock === -1 || collegeBlock === 6 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                6 корпус
              </h2>
              <ClassesScheduleGrid
                kind={isMixed ? 'mixed' : 'main'}
                collegeBlock={6}
                date={date}
                weekDay={WEEKDAYS_MAP[date.getDay()]}
                weekType={weekType}
              />
            </>
          ) : null}
          {/* <button onClick={() => setOpened(p => !p)}>oopene</button> */}
        </div>
        <div className="flex-shrink-0">
          <Sidebar opened={true}>
            <div className="h-full">
              <div className="mb-3">
                <Calendar date={date} setDate={setDate} />
              </div>
              <div className="mb-3">
                <CollegeBlockToggles
                  value={collegeBlock}
                  setValue={setCollegeBlock}
                />
              </div>
              <div className="mb-3">
                <Toggles value={isMixed} setValue={setIsMixed}>
                  <Toggles.Variant value={false}>Основное</Toggles.Variant>
                  <Toggles.Variant value={true}>С изменениями</Toggles.Variant>
                </Toggles>
              </div>
              <InputSearch
                placeholder="Группа"
                value={groupSearch}
                onChange={e => setGroupSearch(e.currentTarget.value)}
              />
            </div>
          </Sidebar>
        </div>
      </div>
    </BaseLayout>
  );
}
