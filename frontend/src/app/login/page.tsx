'use client';

import { signIn } from 'next-auth/react';
import { TextField, Button } from '@/shared/ui/Controls';
import { FormEventHandler, useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    signIn('credentials', {
      username,
      password,
      callbackUrl: '/admin',
    });
  };

  return (
    <div className="grid h-full place-items-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-10 text-center text-xl font-bold text-slate-800 dark:text-zinc-50 md:text-2xl">
          Вход в аккаунт
        </h1>
        <form className="mb-10 space-y-6" onSubmit={handleSubmit}>
          <TextField
            type="text"
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
            className="h-8 w-full"
            variant="primary"
            disabled={!username || !password}
          >
            Войти
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-slate-700 dark:text-zinc-400">Вернуться </span>
          <Link
            className="font-semibold text-primary-400 transition-colors hover:text-primary-500"
            href="/"
          >
            на главную
          </Link>
        </div>
        {/* // TODO {router.query.error === 'CredentialsSignin' ? (
          <div className="mt-6 text-center text-xs text-red-500 sm:text-sm md:mt-8">
            Неверное имя пользователя или пароль
          </div>
        ) : null} */}
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Вход',
};
