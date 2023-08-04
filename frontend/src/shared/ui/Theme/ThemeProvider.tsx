'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Theme } from './types';
import { createStore, useStore } from 'zustand';

export type ThemeState = {
  theme: Theme;
  toggle: (theme?: Theme) => void;
};

export type ThemeStore = ReturnType<typeof createThemeStore>;

function createThemeStore(theme: Theme) {
  return createStore<ThemeState>(set => ({
    theme,
    toggle(theme) {
      if (!theme) {
        set(p => ({ theme: p.theme === 'light' ? 'dark' : 'light' }));
      } else {
        set({ theme });
      }
    },
  }));
}

const ThemeContext = createContext<ThemeStore | null>(null);

export type ThemeProviderProps = PropsWithChildren<{
  theme?: string;
}>;

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const store = useRef<ThemeStore>();

  if (!store.current) {
    store.current = createThemeStore(
      theme === 'dark' || theme === 'light' ? theme : 'light',
    );
  }
  const initTheme = useCallback(async () => {
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    store.current?.setState({ theme: preferredTheme });
  }, []);

  useEffect(() => {
    return store.current?.subscribe((state, prev) => {
      if (state.theme !== prev.theme) {
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        document
          .querySelector('meta[name="color-scheme"]')
          ?.setAttribute('content', state.theme);
      }
    });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const unsubscribe = store.current!.subscribe(state => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        fetch('/api/theme', {
          method: 'POST',
          body: state.theme,
        });
        timeout = null;
      }, 300);
    });
    return () => {
      unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  useEffect(() => {
    if (!theme) {
      initTheme();
    }
  }, [theme, initTheme]);

  return (
    <ThemeContext.Provider value={store.current}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme<T>(selector: (state: ThemeState) => T) {
  return useStore(useContext(ThemeContext)!, selector);
}
