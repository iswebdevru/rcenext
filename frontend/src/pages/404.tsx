import Link from 'next/link';

export default function FourOhFour() {
  return (
    <div className="h-full grid place-items-center p-4">
      <div className="max-w-md text-center">
        <div className="text-primary-600 text-7xl font-bold mb-4">404</div>
        <div className="text-slate-700 text-xl font-bold mb-4 dark:text-zinc-200">
          Страница не найдена
        </div>
        <div className="text-slate-600 mb-8 dark:text-zinc-400">
          Запрашиваемая страница удалена или не существует
        </div>
        <div className="text-sm text-center">
          <span className="text-slate-700 dark:text-zinc-400">Вернуться </span>
          <Link
            className="text-primary-400 font-semibold hover:text-primary-500 transition-colors"
            href="/"
          >
            на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
