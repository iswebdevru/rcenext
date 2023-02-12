import { FormEvent, useState } from 'react';
import { withCSRF } from '@/shared/middlewares';
import { useRouter } from 'next/router';

export default function Register({ csrf }: { csrf: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  // const [password2, setPassword2] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        csrf,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return (
    <div>
      <form onSubmit={submit}>
        <input
          type="text"
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="password"
          onChange={e => setPassword(e.target.value)}
          value={password}
        />
        {/* <input type="password" onChange={e => setPassword2(e.target.value)} /> */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export const getServerSideProps = withCSRF();
