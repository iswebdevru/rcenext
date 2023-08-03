'use client';

import { Calendar } from '@/shared/ui/Calendar';
import { SelectBellsScheduleVariant } from '@/shared/ui/Select';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatDate } from '@/shared/lib/date';
import { prepareVariant } from '@/entities/bells';
import { useDebounce, useUpdateSearchParams } from '@/shared/hooks';
import { prepareDate } from '@/shared/lib/filters';

export function BellsScheduleFilters() {
  const searchParams = useSearchParams()!;

  const [variant, setVariant] = useState(
    prepareVariant(searchParams.get('variant')),
  );
  const [date, setDate] = useState(prepareDate(searchParams.get('date')));

  const debouncedVariant = useDebounce(variant);
  const debouncedDate = useDebounce(date);

  useUpdateSearchParams({
    date: formatDate(debouncedDate),
    variant: debouncedVariant,
  });

  return (
    <div className="space-y-4">
      <Calendar onDateChange={setDate} date={date} />
      <SelectBellsScheduleVariant variant={variant} onChange={setVariant} />
    </div>
  );
}
