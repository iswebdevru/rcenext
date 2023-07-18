import { clsx } from '@/shared/lib/ui';
import { PropsWithChildren } from 'react';

export type SidebarProps = {
  opened: boolean;
} & PropsWithChildren;

export function Sidebar({ children, opened }: SidebarProps) {
  return (
    <div
      className={clsx('fixed right-0 top-0 h-full transition lg:static', {
        'translate-x-full lg:translate-x-0': !opened,
        'translate-x-0': opened,
      })}
    >
      {children}
    </div>
  );
}
