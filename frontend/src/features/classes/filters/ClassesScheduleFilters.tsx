'use client';

import { Calendar } from '@/shared/ui/Calendar';
import { Toggles, SearchField, CheckboxField } from '@/shared/ui/Controls';
import { Wrapper } from './Wrapper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GroupSelect } from '@/features/groups'; // todo: move to /entities
import { useState } from 'react';
import { prepareDate } from '@/shared/lib/filters';
import { prepareBlock, prepareType } from '@/entities/classes';
import { useDebounce, useUpdateEffect } from '@/shared/hooks';
import { formatDate, getWeekTypeFromDate } from '@/shared/lib/date';
import { getWeekDayExcerpt } from '@/shared/lib/human';

export function ClassesScheduleFilters() {
  const searchParams = useSearchParams()!;
  const router = useRouter();
  const pathname = usePathname();

  const [type, setType] = useState(prepareType(searchParams.get('type')));
  const [date, setDate] = useState(prepareDate(searchParams.get('date')));
  const [groupName, setGroupName] = useState(
    searchParams.get('group__name') ?? '',
  );
  const [cabinet, setCabinet] = useState(searchParams.get('cabinet') ?? '');
  const [block, setBlock] = useState(prepareBlock(searchParams.get('block')));

  const debouncedType = useDebounce(type);
  const debouncedDate = useDebounce(date);
  const debouncedGroupName = useDebounce(groupName);
  const debouncedCabinet = useDebounce(cabinet);
  const debouncedBlock = useDebounce(block);

  useUpdateEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    nextSearchParams.set('type', debouncedType);
    nextSearchParams.set('date', formatDate(debouncedDate));
    nextSearchParams.set('group__name', debouncedGroupName);
    nextSearchParams.set('cabinet', debouncedCabinet);
    nextSearchParams.set('block', debouncedBlock);
    nextSearchParams.set('week_day', getWeekDayExcerpt(date));
    nextSearchParams.set('week_type', getWeekTypeFromDate(date));

    router.push(`${pathname}?${nextSearchParams}`);
  }, [
    router,
    pathname,
    searchParams,
    debouncedType,
    debouncedDate,
    debouncedGroupName,
    debouncedCabinet,
    debouncedBlock,
  ]);

  return (
    <Wrapper>
      <div className="space-y-4">
        <Calendar date={date} onDateChange={setDate} />
        <GroupSelect
          groupSearch={groupName}
          onGroupSearchChange={setGroupName}
          onSelect={group => setGroupName(group.name)}
        />
        <SearchField
          name="cabinet"
          autoComplete="off"
          placeholder="Кабинет"
          value={cabinet}
          onChange={e => setCabinet(e.currentTarget.value)}
        />
        <Toggles value={block} onToggle={setBlock}>
          <Toggles.Variant value="-1">Все</Toggles.Variant>
          <Toggles.Variant value="1">1-5</Toggles.Variant>
          <Toggles.Variant value="6">6</Toggles.Variant>
        </Toggles>
        <Toggles value={type} onToggle={setType}>
          <Toggles.Variant value="main">Основное</Toggles.Variant>
          <Toggles.Variant value="mixed">С изменениями</Toggles.Variant>
        </Toggles>
        <CheckboxField label="Показывать звонки" /> {/* todo: react on it */}
      </div>
    </Wrapper>
  );
}
