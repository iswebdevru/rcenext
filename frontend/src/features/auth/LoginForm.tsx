'use client';

import { signIn } from 'next-auth/react';
import { FormEventHandler, useState } from 'react';
import { TextField, Button } from '@/shared/ui/Controls';

export function LoginForm() {
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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="space-y-4">
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
      </div>
      <Button
        type="submit"
        className="h-8 w-full"
        variant="primary"
        disabled={!username || !password}
      >
        Войти
      </Button>
    </form>
  );
}
