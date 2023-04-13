import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/modal';
import { Select } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/Toggles';
import { WEEK_DAYS, WEEK_TYPES, WeekDay, WeekType } from '@/shared/constants';
import { CreateClassesSchedule } from '@/features/classes';
import { AdminLayout } from '@/layouts';
import {
  API_CLASSES_CHANGES,
  API_CLASSES_MAIN,
  createEntity,
} from '@/shared/api';
import { formatDate } from '@/shared/lib/common';

type ClassesScheduleType = 'main' | 'changes';

export default function Edit() {
  const [scheduleType, setScheduleType] = useState<ClassesScheduleType>('main');
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
          <div className="grid grid-cols-4 gap-4">
            {/* {timetableData.map((data, i) => (
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
            ))} */}
          </div>
        </div>
        <div className="shrink-0 w-80">
          <div className="mb-2">
            <InputSearch placeholder="Группа" />
          </div>
          <div className="mb-2">
            <Toggles value={scheduleType} setValue={setScheduleType}>
              <Toggles.Variant value="main">Основное</Toggles.Variant>
              <Toggles.Variant value="changes">Изменения</Toggles.Variant>
            </Toggles>
          </div>
          {scheduleType === 'main' ? (
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
        <CreateClassesSchedule
          onSubmit={({ group, periods }) => {
            if (scheduleType === 'main') {
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
