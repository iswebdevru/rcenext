'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import { Theme } from './types';
import { useRouter } from 'next/navigation';

const ThemeContext = createContext<Theme>('light');

export type ThemeProviderProps = PropsWithChildren<{
  theme: Theme | null;
}>;

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const router = useRouter();

  const initTheme = useCallback(async () => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    await fetch('/api/theme', { method: 'POST', body: preferredTheme });
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (!theme) {
      initTheme();
    }
  }, [theme, initTheme]);

  return (
    <ThemeContext.Provider value={theme ?? 'light'}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
