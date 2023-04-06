import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Theme = 'dark' | 'light';

export type ThemeContext = {
  theme: Theme | null;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContext>(undefined as any);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, _setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const cachedTheme = localStorage.getItem('theme') as Theme | null;
    if (!cachedTheme) {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      localStorage.setItem('theme', preferredTheme);
      _setTheme(preferredTheme);
    } else {
      _setTheme(cachedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme !== null) {
      localStorage.setItem('theme', theme);
    }
    if (
      theme === 'dark' &&
      !document.documentElement.classList.contains('dark')
    ) {
      document.documentElement.classList.add(theme);
    } else if (
      theme === 'light' &&
      document.documentElement.classList.contains('dark')
    ) {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(
    () => _setTheme(p => (p === 'dark' ? 'light' : 'dark')),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
