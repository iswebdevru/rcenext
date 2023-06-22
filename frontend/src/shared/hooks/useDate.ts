import { useEffect, useState } from 'react';

export function useDate() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
  }, []);

  return [date, setDate] as const;
}
