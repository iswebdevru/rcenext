import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/Input';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEventHandler, useId, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginLabelId = useId();
  const passwordLabelId = useId();

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    signIn('credentials', {
      username,
      password,
      callbackUrl: '/admin',
    });
  };

  return (
    <div className="grid place-items-center h-full p-4">
      <div className="max-w-sm w-full">
        <h1 className="text-slate-800 dark:text-zinc-50 mb-10 text-xl font-bold text-center md:text-2xl">
          Вход в аккаунт
        </h1>
        <form className="space-y-6 mb-10" onSubmit={handleSubmit}>
          <TextField
            type="text"
            id={loginLabelId}
            label="Логин"
            placeholder="Логин"
            name="login"
            autoComplete="username"
            required
            value={username}
            onChange={e => setUsername(e.currentTarget.value)}
          />

          <TextField
            type="password"
            id={passwordLabelId}
            label="Пароль"
            placeholder="Пароль"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => setPassword(e.currentTarget.value)}
          />
          <Button
            type="submit"
            className="w-full h-8"
            variant="primary"
            disabled={!username || !password}
          >
            Войти
          </Button>
        </form>
        <div className="text-sm text-center">
          <span className="text-slate-700 dark:text-zinc-400">Вернуться </span>
          <Link
            className="text-primary-400 font-semibold hover:text-primary-500 transition-colors"
            href="/"
          >
            на главную
          </Link>
        </div>
        {router.query.error === 'CredentialsSignin' ? (
          <div className="mt-6 text-xs text-center text-red-500 sm:text-sm md:mt-8">
            Неверное имя пользователя или пароль
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
