import { useTheme, useThemeEffect } from '@/shared/ui/Theme';

const WIDTH = 42;
const HEIGHT = 22;
const R = 7;

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  useThemeEffect();

  const isDark = theme === 'dark';

  return (
    <button onClick={toggleTheme}>
      <svg height={HEIGHT} viewBox="0 0 42 22">
        <rect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          rx={12}
          className="transition-all fill-zinc-300 dark:fill-zinc-900"
        ></rect>
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 : HEIGHT / 2}
          cy={HEIGHT / 2}
          r={R}
          className="transition-all fill-white dark:fill-zinc-200"
        />
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 - R : HEIGHT / 2 - R}
          cy={11}
          r={isDark ? R : 0}
          className="transition-all fill-zinc-300 dark:fill-zinc-900"
        />
      </svg>
    </button>
  );
}
