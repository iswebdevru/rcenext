import Calendar from '@/shared/ui/calendar';
import { Search } from '@/shared/ui/input';
import Toggles, { Variant } from '@/shared/ui/toggles';
import { useState } from 'react';

export default function Edit() {
  const [timetableType, setTimetableType] = useState('Основное');
  const [date, setDate] = useState(new Date());

  return (
    <div className="container flex">
      <div className="grow"></div>
      <div>
        <Search placeholder="Группа" />
        <Toggles value={timetableType} setValue={setTimetableType}>
          <Variant value="Основное">Основное</Variant>
          <Variant value="Изменения">Изменения</Variant>
        </Toggles>
        {timetableType === 'Основное' ? (
          <>Выбор дня недели</>
        ) : (
          <Calendar date={date} setDate={setDate} />
        )}
      </div>
    </div>
  );
}
