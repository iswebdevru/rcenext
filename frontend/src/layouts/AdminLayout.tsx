import { AdminNav } from '@/entities/admin';
import { PropsWithChildren } from 'react';
import { BaseLayout } from './BaseLayout';

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout wide fixed>
      <div className="flex h-full">
        <div className="flex-shrink-0">
          <AdminNav />
        </div>
        <div className="grow pt-14 lg:pl-64">{children}</div>
      </div>
    </BaseLayout>
  );
}
