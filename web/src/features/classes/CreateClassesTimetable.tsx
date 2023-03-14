import { Button } from '@/shared/ui/button';
import { InputText } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/select';

export function CreateClassesTimetable() {
  return (
    <div className="p-6 bg-white rounded-md shadow-lg">
      <form>
        <div className="flex flex-col items-start">
          <label className="mb-2 text-neutral-600">Группа:</label>
          <Select onChange={() => {}}></Select>
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
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <tr key={i} className="opacity-50 focus-within:opacity-100">
                <td className="px-1 py-1 text-center w-[6%]">{i}</td>
                <td className="px-1 py-1 w-[32%]">
                  <Select
                    required
                    searchString="asdf"
                    onSearchStringChange={() => {}}
                    onChange={() => {}}
                  ></Select>
                </td>
                <td className="px-1 py-1 w-[32%]">
                  <Select
                    required
                    searchString="asdf"
                    onSearchStringChange={() => {}}
                    onChange={() => {}}
                  ></Select>
                </td>
                <td className="w-[15%] px-1 py-1 ">
                  <InputText placeholder="Кабинет" />
                </td>
                <td className="w-[15%] px-1 py-1 ">
                  <InputText placeholder="Примечание" />
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
