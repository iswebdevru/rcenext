import { useEffect, useRef, useState } from 'react';

/**
 * Returns debounced value
 * @param value value to track changes from
 * @param ms time to ignore value
 */
export function useDebounce<T>(value: T, ms: number = 250): T {
  const [derivedState, setDerivedState] = useState(value);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      setDerivedState(value);
      timeoutIdRef.current = null;
    }, ms);
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [value, ms]);

  return derivedState;
}
