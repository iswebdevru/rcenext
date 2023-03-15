import AdminNav from '@/widgets/AdminNav';
import { PropsWithChildren } from 'react';
import { BaseLayout } from './BaseLayout';

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout wide>
      <div className="flex h-full">
        <div className="flex-shrink-0">
          <AdminNav />
        </div>
        <div className="grow">{children}</div>
      </div>
    </BaseLayout>
  );
}
