import Calendar from '@/shared/ui/calendar';
import Sidebar from '@/shared/ui/sidebar';
import { useState } from 'react';

export default function Classes() {
  const [date, setDate] = useState(new Date());
  const [opened, setOpened] = useState(false);

  return (
    <div className="container flex basis-full">
      <div>
        <div>
          <h1>Расписание пар</h1>
          <div className="grid justify-between w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <table className="border">
              <tbody>
                <tr className="border">
                  <th className="border" colSpan={3}>
                    ИС-203
                  </th>
                </tr>
                <tr className="border">
                  <td className="border">{'<Кабинет>'}</td>
                  <td className="border">
                    {'<Предмет>'} <br /> {'<Преподаватель>'}
                  </td>
                  <td className="border">{'<Примечание>'}</td>
                  <td className="border">{'<Кабинет>'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button onClick={() => setOpened(p => !p)}>oopene</button>
      </div>
      <div className="flex-shrink-0">
        <Sidebar opened={opened}>
          <div className="h-full px-4 py-8">
            <Calendar date={date} setDate={setDate} />
            <div>панель с выбором корпуса (по умолч - все)</div>
            <div>основное/с учетом изменений (по умолч.)</div>
            <div>поиск по группе</div>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
