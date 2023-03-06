import { clsx } from '@/shared/lib/ui';
import { PropsWithChildren } from 'react';

export type SidebarProps = {
  opened: boolean;
} & PropsWithChildren;

export function Sidebar({ children, opened }: SidebarProps) {
  return (
    <div
      className={clsx({
        'fixed top-0 h-full right-0 transition lg:static': true,
        'translate-x-full lg:translate-x-0': !opened,
        'translate-x-0': opened,
      })}
    >
      {children}
    </div>
  );
}
