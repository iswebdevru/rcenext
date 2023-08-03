'use client';

import { PropsWithChildren, createContext, useContext, useEffect } from 'react';
import { Theme } from './types';
import { changeTheme } from './change-theme';

const ThemeContext = createContext<Theme>('light');

export type ThemeProviderProps = PropsWithChildren<{
  theme: Theme | null;
}>;

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  useEffect(() => {
    if (!theme) {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      changeTheme(preferredTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme ?? 'light'}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
