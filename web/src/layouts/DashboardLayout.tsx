import AdminNav from '@/widgets/admin-nav';
import { PropsWithChildren } from 'react';
import { BaseLayout } from './BaseLayout';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout>
      <div className="flex h-full">
        <div className="flex-shrink-0">
          <AdminNav />
        </div>
        <div className="grow">{children}</div>
      </div>
    </BaseLayout>
  );
}
