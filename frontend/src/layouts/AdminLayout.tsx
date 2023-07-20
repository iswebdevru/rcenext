import { AdminNav } from '@/entities/admin';
import { PropsWithChildren } from 'react';
import { BaseLayout } from './BaseLayout';

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout wide>
      <div className="flex h-full flex-col lg:flex-row">
        <div className="flex-none">
          <AdminNav />
        </div>
        <div className="flex-auto lg:pl-64">{children}</div>
      </div>
    </BaseLayout>
  );
}
