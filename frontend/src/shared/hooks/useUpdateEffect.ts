import { DependencyList, EffectCallback, useEffect } from 'react';
import { useIsFirstRender } from './useIsFirstRender';
import { noop } from '../lib/common';

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (isFirstRender) {
      return noop;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
