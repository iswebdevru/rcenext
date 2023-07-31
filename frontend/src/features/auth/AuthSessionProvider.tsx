'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

export type AuthSessionProviderProps = {
  session: Session | null;
} & PropsWithChildren;

export function AuthSessionProvider({
  session,
  children,
}: AuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
