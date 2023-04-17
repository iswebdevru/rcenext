import { useEffect } from 'react';
import { create } from 'zustand';

export type Theme = 'dark' | 'light';

export type ThemeState = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useTheme = create<ThemeState>(set => ({
  theme: localStorage.getItem('theme') as Theme,
  setTheme(theme) {
    set({ theme });
  },
  toggleTheme() {
    set(state => {
      const theme = state.theme === 'light' ? 'dark' : 'light';
      return { theme };
    });
  },
}));

export function useThemeEffect() {
  const theme = useTheme(state => state.theme);
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
}
