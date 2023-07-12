import { useEffect } from 'react';

export function useOnMount(onMount: () => void) {
  useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
