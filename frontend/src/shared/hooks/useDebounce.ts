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
  }, [value]);

  return derivedState;
}

// 't'
// 'th'
// 'thi'
// 'this'

// 'this i'
// 'this is'
// 'this is a'
// 'this is am'
// 'this is ame'

// 'this is amer'
// 'this is ameri'
// 'this is americ'
// 'this is america'
