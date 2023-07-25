import Head from 'next/head';
import Link from 'next/link';

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>Не найдено</title>
      </Head>
      <div className="grid h-full place-items-center p-4">
        <div className="max-w-md text-center">
          <div className="mb-4 text-7xl font-bold text-primary-600">404</div>
          <div className="mb-4 text-xl font-bold text-slate-700 dark:text-zinc-200">
            Страница не найдена
          </div>
          <div className="mb-8 text-slate-600 dark:text-zinc-400">
            Запрашиваемая страница удалена или не существует
          </div>
          <div className="text-center text-sm">
            <span className="text-slate-700 dark:text-zinc-400">
              Вернуться{' '}
            </span>
            <Link
              className="font-semibold text-primary-400 transition-colors hover:text-primary-500"
              href="/"
            >
              на главную
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
