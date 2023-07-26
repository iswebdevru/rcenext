'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

export type AuthSessionProvider = {
  session: Session | null;
} & PropsWithChildren;

export function AuthSessionProvider({
  session,
  children,
}: AuthSessionProvider) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
