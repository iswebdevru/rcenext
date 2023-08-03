import { useEffect, useLayoutEffect } from 'react';
import { isBrowser } from '../constants';

export const useIsomorphicEffect = isBrowser ? useLayoutEffect : useEffect;
