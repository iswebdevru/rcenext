import { clsx } from '@/shared/lib/ui';
import { useTheme } from '@/shared/ui/theme';

const WIDTH = 42;
const HEIGHT = 22;
const R = 7;

export function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();

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
          className={clsx({
            'transition-all': true,
            'fill-slate-800': !isDark,
            'fill-slate-200': isDark,
          })}
        ></rect>
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 : HEIGHT / 2}
          cy={HEIGHT / 2}
          r={R}
          className={clsx({
            'transition-all ': true,
            'fill-slate-50': !isDark,
            'fill-black': isDark,
          })}
        />
        <circle
          cx={isDark ? WIDTH - HEIGHT / 2 - R : HEIGHT / 2 - R}
          cy={11}
          r={isDark ? R : 0}
          className={clsx({
            'transition-all': true,
            'fill-slate-800': !isDark,
            'fill-slate-200': isDark,
          })}
        />
      </svg>
    </button>
  );
}
