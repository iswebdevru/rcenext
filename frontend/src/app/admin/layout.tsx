import { PropsWithChildren } from 'react';
import { AdminNav } from '@/entities/admin';
import { Protected } from '@/features/auth';
import { Header } from '@/widgets/Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Protected>
      <div className="flex h-full flex-col">
        <div className="mb-14 flex-none">
          <Header wide />
        </div>
        <div className="flex-auto">
          <div className="flex h-full flex-col lg:flex-row">
            <div className="flex-none">
              <AdminNav />
            </div>
            <div className="flex-auto lg:pl-64">{children}</div>
          </div>
        </div>
      </div>
    </Protected>
  );
}

export const metadata = {
  title: {
    default: 'РКЭ Админ',
    template: '%s | РКЭ Админ',
  },
};
