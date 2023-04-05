import { clsx } from '@/shared/lib/ui';
import { useState } from 'react';

// 1. Пользователь впервые посещает сайт
// 2. Установив этот факт, определяем тему по предпочтениям пользователя
// 3. Кэшируем соответствующую тему в localStorage
// 4. Выбираем ее по умолчанию при последующих отрисовках
// 5. В случае, если пользователь переключает тему, мы обновляем закэшированное значение

// TODO: Добавить Redux, использовать useEffect для фикса SSR, синхронизация с DOM

const WIDTH = 42;
const HEIGHT = 22;
const R = 7;

export function ThemeToggler() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const theme = localStorage.getItem('theme');

    const isDarkPreferred =
      theme === 'dark' ||
      (theme === null &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    localStorage.setItem('theme', isDarkPreferred ? 'dark' : 'light');
    return isDarkPreferred;
  });

  return (
    <button onClick={() => setIsDark(p => !p)}>
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
