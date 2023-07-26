import { AdminNav } from '@/entities/admin';
import { Header } from '@/widgets/Header';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
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
  );
}
