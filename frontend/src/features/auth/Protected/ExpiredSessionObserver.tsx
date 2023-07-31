'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { PropsWithChildren, useEffect } from 'react';

async function logoutAndSignIn() {
  await signOut();
  await signIn();
}

export function ExpiredSessionObserver({ children }: PropsWithChildren) {
  const session = useSession({ required: true });

  useEffect(() => {
    if (session.data?.error) {
      logoutAndSignIn();
    }
  }, [session.data?.error]);

  return <>{children}</>;
}
