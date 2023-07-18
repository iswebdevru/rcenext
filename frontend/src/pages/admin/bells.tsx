import { AdminLayout } from '@/layouts';
import { WeekDay } from '@/shared/api';
import { CheckboxField, TextField } from '@/shared/ui/Controls';
import { BellsType, SelectBellsType, SelectWeekDay } from '@/shared/ui/Select';
import { useState } from 'react';

type BellsPeriod = {
  index: number;
} & (
  | { withBreak: false; from: string; to: string }
  | {
      withBreak: true;
      fromBefore: string;
      toBefore: string;
      fromAfter: string;
      toAfter: string;
    }
);

const periods: BellsPeriod[] = [
  {
    index: 0,
    withBreak: false,
    from: '',
    to: '',
  },
  {
    index: 1,
    withBreak: false,
    from: '',
    to: '',
  },
  {
    index: 2,
    withBreak: false,
    from: '',
    to: '',
  },
  {
    index: 3,
    withBreak: false,
    from: '',
    to: '',
  },
  {
    index: 4,
    withBreak: false,
    from: '',
    to: '',
  },
  {
    index: 5,
    withBreak: false,
    from: '',
    to: '',
  },
];

export default function Bells() {
  const [bellsType, setBellsType] = useState<BellsType>('normal');
  const [weekDay, setWeekDay] = useState<WeekDay>('ПН');

  return (
    <AdminLayout>
      <div className="p-4">
        <div className="max-w-xs">
          <SelectWeekDay onSelect={setWeekDay} weekDayId={weekDay} />
        </div>
        <div className="max-w-xs">
          <SelectBellsType type={bellsType} onChange={setBellsType} />
        </div>
        <div className="max-w-xs"></div>
        <table className="border-collapse">
          <tbody>
            <tr>
              <th className="p-0 text-left">№</th>
              <th className="p-0 text-left">Начало</th>
              <th className="p-0 text-left">Конец</th>
              <th className="p-0 text-left">С перерывом</th>
            </tr>
            {periods.map(period => (
              <tr key={period.index}>
                <td className="p-0">{period.index}</td>
                {period.withBreak ? (
                  <>
                    <td className="p-0">
                      <TextField value={period.fromBefore} />
                      <TextField value={period.fromAfter} />
                    </td>
                    <td className="p-0">
                      <TextField value={period.toBefore} />
                      <TextField value={period.toAfter} />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-6">
                      <TextField value={period.from} />
                    </td>
                    <td className="p-6">
                      <TextField value={period.to} />
                    </td>
                  </>
                )}
                <td className="p-6">
                  <CheckboxField name="with_break" label="" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
