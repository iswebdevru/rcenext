import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { authOptions } from '@/shared/packages/next-auth';
import { ExpiredSessionObserver } from './ExpiredSessionObserver';
import { AuthSessionProvider } from '../AuthSessionProvider';

export async function Protected({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <AuthSessionProvider session={session}>
      <ExpiredSessionObserver>{children}</ExpiredSessionObserver>
    </AuthSessionProvider>
  );
}
