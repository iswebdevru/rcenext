import { PropsWithChildren } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/shared/packages/next-auth';
import { AuthSessionProvider } from '@/features/auth';
import { Header } from '@/widgets/Header';

export default async function Layout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions);

  return (
    <AuthSessionProvider session={session}>
      <div className="flex h-full flex-col">
        <div className="mb-14 flex-none">
          <Header />
        </div>
        <div className="flex-auto">{children}</div>
      </div>
    </AuthSessionProvider>
  );
}