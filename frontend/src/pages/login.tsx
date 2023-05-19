import { BaseLayout } from '@/layouts';
import { Button } from '@/shared/ui/Button';
import { InputText } from '@/shared/ui/Input';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FormEventHandler, useId, useState } from 'react';
import { authOptions } from './api/auth/[...nextauth]';

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
    <BaseLayout>
      <div className="flex items-center justify-center w-full h-full p-3">
        <div className="flex-grow max-w-sm px-6 py-8 bg-white border rounded-lg text-slate-900 border-zinc-200 md:px-8 md:py-12 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
          <h1 className="mb-8 text-xl font-bold text-center md:text-2xl">
            Вход
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block mb-1.5 text-sm text-zinc-500 dark:text-zinc-400"
                htmlFor={loginLabelId}
              >
                Пользователь
              </label>
              <InputText
                id={loginLabelId}
                placeholder="login"
                value={username}
                onChange={e => setUsername(e.currentTarget.value)}
                required
              />
            </div>
            <div className="mb-8">
              <label
                className="block mb-1.5 text-sm text-zinc-500 dark:text-zinc-400"
                htmlFor={passwordLabelId}
              >
                Пароль
              </label>
              <InputText
                id={passwordLabelId}
                value={password}
                placeholder="password"
                onChange={e => setPassword(e.currentTarget.value)}
                type="password"
                required
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-8"
              variant="primary"
              disabled={!username || !password}
            >
              Войти
            </Button>
          </form>
          {router.query.error === 'CredentialsSignin' ? (
            <div className="mt-6 text-xs text-center text-red-500 sm:text-sm md:mt-8">
              Неверное имя пользователя или пароль
            </div>
          ) : null}
        </div>
      </div>
    </BaseLayout>
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
