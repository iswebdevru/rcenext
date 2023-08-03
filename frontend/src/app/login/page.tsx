import Link from 'next/link';
import { LoginForm } from '@/features/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/packages/next-auth';
import { redirect } from 'next/navigation';

// TODO {router.query.error === 'CredentialsSignin' ? (

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/admin');
  }

  return (
    <div className="grid h-full place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-10 text-center text-xl font-bold text-slate-800 dark:text-zinc-50 md:text-2xl">
          Вход в аккаунт
        </h1>
        <LoginForm />
        <div className="text-center text-sm">
          <span className="text-slate-700 dark:text-zinc-400">Вернуться </span>
          <Link
            className="font-semibold text-primary-400 transition-colors hover:text-primary-500"
            href="/"
          >
            на главную
          </Link>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Вход',
};
