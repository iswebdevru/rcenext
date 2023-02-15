import { Dispatch, SetStateAction } from 'react';

type CalendarProps = {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
};

type SimplifiedDate = {
  day: number;
  date: number;
  month: number;
};

const DAY = 86400000;

const DAYS_OF_THE_WEEK = {
  0: 'ВС',
  1: 'ПН',
  2: 'ВТ',
  3: 'СР',
  4: 'ЧТ',
  5: 'ПТ',
  6: 'СБ',
} as const;

function get5WeeksAroundCurrentMonth(date: Date) {
  const nextMonth = (date.getMonth() + 1) % 12;
  const currentDate = new Date(date);
  currentDate.setDate(1);
  while (currentDate.getDay() !== 1) {
    currentDate.setTime(currentDate.getTime() - DAY);
  }
  const weeks: SimplifiedDate[][] = [];
  let days: SimplifiedDate[] = [];
  while (currentDate.getMonth() !== nextMonth || currentDate.getDay() !== 1) {
    if (currentDate.getDay() === 1) {
      days = [];
      weeks.push(days);
    }
    days.push({
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      day: currentDate.getDay(),
    });
    currentDate.setTime(currentDate.getTime() + DAY);
  }
  return weeks;
}

export default function Calendar({ date }: CalendarProps) {
  const weeks = get5WeeksAroundCurrentMonth(date);

  return (
    <div className="border border-black">
      <div className="flex justify-between">
        <p>Январь 2020</p>
        <div className="flex gap-4">
          <div>{'<'}</div>
          <div>{'>'}</div>
        </div>
      </div>
      <table className="w-full">
        <tbody>
          <tr>
            <th>ПН</th>
            <th>ВТ</th>
            <th>СР</th>
            <th>ЧТ</th>
            <th>ПТ</th>
            <th>СБ</th>
            <th>ВС</th>
          </tr>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map(day => (
                <td key={`${day.date}-${day.month}`}>{day.date}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
