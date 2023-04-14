import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/modal';
import { Select } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { WEEK_DAYS, WEEK_TYPES } from '@/shared/constants';
import { ClassesScheduleCreate } from '@/features/classes';
import { AdminLayout } from '@/layouts';
import {
  API_CLASSES_CHANGES,
  API_CLASSES_MAIN,
  WeekDay,
  WeekType,
  createEntity,
} from '@/shared/api';
import { formatDate } from '@/shared/lib/date';
import { CollegeBlock, CollegeBlockToggles } from '@/entities/classes';
import { ClassesScheduleGrid } from '@/widgets/classes';

export default function Edit() {
  const [scheduleKind, setScheduleKind] = useState<'main' | 'changes'>('main');
  const [collegeBlock, setCollegeBlock] = useState<CollegeBlock>(-1);
  const [date, setDate] = useState(new Date());
  const [weekType, setWeekType] = useState<WeekType>('ЧИСЛ');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');
  const [showTimetableModal, setShowTimetableModal] = useState(false);

  return (
    <AdminLayout>
      <div className="flex gap-4 p-4">
        <div className="grow">
          <div className="mb-4">
            <Button>Удалить</Button>
            <Button
              className="ml-2"
              onClick={() => setShowTimetableModal(true)}
            >
              Добавить
            </Button>
          </div>
          {collegeBlock === -1 || collegeBlock === 1 ? (
            <>
              <h2 className="mb-4 font-bold text-slate-900 dark:text-slate-200">
                1-5 корпус
              </h2>
              <ClassesScheduleGrid
                kind={scheduleKind}
                collegeBlock={1}
                date={date}
                weekDay={weekDay}
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
                kind={scheduleKind}
                collegeBlock={6}
                date={date}
                weekDay={weekDay}
                weekType={weekType}
              />
            </>
          ) : null}
        </div>
        <div className="shrink-0">
          <div className="mb-2">
            <InputSearch placeholder="Группа" />
          </div>
          <div className="mb-2">
            <CollegeBlockToggles
              value={collegeBlock}
              setValue={setCollegeBlock}
            />
          </div>
          <div className="mb-2">
            <Toggles value={scheduleKind} setValue={setScheduleKind}>
              <Toggles.Variant value="main">Основное</Toggles.Variant>
              <Toggles.Variant value="changes">Изменения</Toggles.Variant>
            </Toggles>
          </div>
          {scheduleKind === 'main' ? (
            <>
              <div className="mb-2">
                <Select value={weekDay} onChange={setWeekDay}>
                  {WEEK_DAYS.map(day => (
                    <Select.Option key={day.id} value={day.id}>
                      {day.value}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Select value={weekType} onChange={setWeekType}>
                {WEEK_TYPES.map(weekType => (
                  <Select.Option key={weekType.id} value={weekType.id}>
                    {weekType.value}
                  </Select.Option>
                ))}
              </Select>
            </>
          ) : (
            <Calendar date={date} setDate={setDate} />
          )}
        </div>
      </div>
      <Modal
        state={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
      >
        <ClassesScheduleCreate
          onSubmit={({ group, periods }) => {
            if (scheduleKind === 'main') {
              createEntity(API_CLASSES_MAIN, {
                body: {
                  group,
                  periods,
                  week_type: weekType,
                  week_day: weekDay,
                },
              });
            } else {
              createEntity(API_CLASSES_CHANGES, {
                body: {
                  group,
                  periods,
                  date: formatDate(date),
                },
              });
            }
          }}
        />
      </Modal>
    </AdminLayout>
  );
}
