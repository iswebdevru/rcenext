'use client';

import { Calendar } from '@/shared/ui/Calendar';
import { SelectBellsScheduleVariant } from '@/shared/ui/Select';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatDate, prepareDate } from '@/shared/lib/date';
import { prepareVariant } from '@/entities/bells';
import { useDebounce, usePrevious } from '@/shared/hooks';
import { noop } from '@/shared/lib/common';

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

  const prevVariant = usePrevious(debouncedVariant);
  const prevDate = usePrevious(debouncedDate);

  useEffect(() => {
    if (prevVariant === undefined && prevDate === undefined) {
      return noop;
    }
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set('date', formatDate(debouncedDate));
    updatedSearchParams.set('variant', debouncedVariant);
    router.push(`${pathname}?${updatedSearchParams}`);
  }, [
    debouncedDate,
    debouncedVariant,
    router,
    pathname,
    searchParams,
    prevVariant,
    prevDate,
  ]);

  return (
    <div className="space-y-4">
      <Calendar onDateChange={setDate} date={date} />
      <SelectBellsScheduleVariant variant={variant} onChange={setVariant} />
    </div>
  );
}
