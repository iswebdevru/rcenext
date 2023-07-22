import { useEffect, useRef } from 'react';
import { noop } from '../lib/common';

export function useTimeout(fn: () => void, ms: number | null) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (ms === null) {
      return noop;
    }
    const timer = setTimeout(() => fnRef.current(), ms);
    return () => clearTimeout(timer);
  }, [ms]);
}
