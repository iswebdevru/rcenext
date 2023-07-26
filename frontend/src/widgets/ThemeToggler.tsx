'use client';

import { useTheme, useThemeEffect } from '@/shared/ui/Theme';

const WIDTH = 42;
const HEIGHT = 22;
const R = 7;

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

  useThemeEffect();

  const isDark = theme === 'dark';

  return (
    <button type="button" onClick={toggleTheme}>
      <svg className="h-7 lg:h-6" viewBox="0 0 42 22">
        <rect
          x={0}
          y={0}
          width={WIDTH}
          height={HEIGHT}
          rx={12}
          className="fill-zinc-300 transition-all dark:fill-zinc-700"
        ></rect>
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 : HEIGHT / 2}
          cy={HEIGHT / 2}
          r={R}
          className="fill-white transition-all dark:fill-zinc-200"
        />
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 - R : HEIGHT / 2 - R}
          cy={11}
          r={isDark ? R : 0}
          className="fill-zinc-300 transition-all dark:fill-zinc-700"
        />
      </svg>
    </button>
  );
}
