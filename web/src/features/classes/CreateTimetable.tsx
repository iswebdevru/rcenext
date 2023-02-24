import { InputText } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

export function CreateTimetable() {
  return (
    <form>
      <div className="flex">
        <label htmlFor="">Группа:</label>
        <Select onChange={() => {}}></Select>
      </div>
      <table>
        <tbody>
          <tr>
            <th className="p-2 font-semibold text-neutral-800">№</th>
            <th className="p-2 font-semibold text-left text-neutral-800">
              Предмет
            </th>
            <th className="p-2 font-semibold text-left text-neutral-800">
              Преподаватель
            </th>
            <th className="p-2 font-semibold text-left text-neutral-800">
              Кабинет
            </th>
            <th className="p-2 font-semibold text-left text-neutral-800">
              Примечание
            </th>
          </tr>
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <tr key={i} className="opacity-50 focus-within:opacity-100">
              <td className="px-2 py-1 text-center">{i}</td>
              <td className="px-2 py-1 ">
                <Select
                  required
                  searchString="asdf"
                  onSearchStringChange={() => {}}
                  onChange={() => {}}
                ></Select>
              </td>
              <td className="px-2 py-1 ">
                <Select
                  required
                  searchString="asdf"
                  onSearchStringChange={() => {}}
                  onChange={() => {}}
                ></Select>
              </td>
              <td className="px-2 py-1 ">
                <InputText placeholder="Кабинет" />
              </td>
              <td className="px-2 py-1 ">
                <InputText placeholder="Примечание" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex">
        <button type="button">Загрузить из основного</button>
        <button type="button" className="ml-auto">
          Отменить
        </button>
        <button type="submit">Сохранить</button>
      </div>
    </form>
  );
}
