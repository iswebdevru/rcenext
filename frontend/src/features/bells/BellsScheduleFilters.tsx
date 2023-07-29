'use client';

import { Calendar } from '@/shared/ui/Calendar';
import { SelectBellsScheduleVariant } from '@/shared/ui/Select';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/shared/lib/date';
import { prepareVariant } from '@/entities/bells';
import { useDebounce, useUpdateEffect } from '@/shared/hooks';
import { prepareDate } from '@/shared/lib/filters';

export function BellsScheduleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const [variant, setVariant] = useState(
    prepareVariant(searchParams.get('variant')),
  );
  const [date, setDate] = useState(prepareDate(searchParams.get('date')));

  const debouncedVariant = useDebounce(variant);
  const debouncedDate = useDebounce(date);

  useUpdateEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.set('date', formatDate(debouncedDate));
    nextSearchParams.set('variant', debouncedVariant);
    router.push(`${pathname}?${nextSearchParams}`);
  }, [router, pathname, searchParams, debouncedDate, debouncedVariant]);

  return (
    <div className="space-y-4">
      <Calendar onDateChange={setDate} date={date} />
      <SelectBellsScheduleVariant variant={variant} onChange={setVariant} />
    </div>
  );
}
