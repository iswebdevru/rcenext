import { useState } from 'react';
import { ClassesTimetable, Timetable } from '@/entities/classes';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { InputSearch } from '@/shared/ui/Input';
import { Modal } from '@/shared/ui/modal';
import { Select } from '@/shared/ui/select';
import { Toggles } from '@/shared/ui/toggles';
import {
  DAYS_OF_THE_WEEK,
  TIMETABLE_TYPES,
  WEEK_TYPES,
} from '@/shared/constants';
import { CreateClassesTimetable } from '@/features/classes';
import { AdminLayout } from '@/layouts';

export default function Edit() {
  const [selectedTimetableType, setTimetableType] = useState(0);
  const [selectedWeekType, setSelectedWeekType] = useState(0);
  const [date, setDate] = useState(new Date());
  const [selectedDayOfTheWeek, setSelectedDayOfTheWeek] = useState('1');
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
            <Toggles value={selectedTimetableType} setValue={setTimetableType}>
              {TIMETABLE_TYPES.map(timetableType => (
                <Toggles.Variant
                  key={timetableType.id}
                  value={timetableType.id}
                >
                  {timetableType.value}
                </Toggles.Variant>
              ))}
            </Toggles>
          </div>
          {selectedTimetableType === 0 ? (
            <>
              <div className="mb-2">
                <Select
                  value={selectedDayOfTheWeek}
                  onChange={setSelectedDayOfTheWeek}
                >
                  {DAYS_OF_THE_WEEK.map(day => (
                    <Select.Option key={day.id} value={day.id}>
                      {day.value}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <Select value={selectedWeekType} onChange={setSelectedWeekType}>
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
        <CreateClassesTimetable />
      </Modal>
    </AdminLayout>
  );
}
