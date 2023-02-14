export default function Classes() {
  return (
    <div>
      <div className="container flex gap-6">
        <div className="w-80 outline">
          <div>панель с выбором даты</div>
          <div>панель с выбором корпуса (по умолч - все)</div>
          <div>основное/с учетом изменений (по умолч.)</div>
          <div>поиск по группе</div>
        </div>
        <div className="grid justify-between w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 outline">
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
    </div>
  );
}
