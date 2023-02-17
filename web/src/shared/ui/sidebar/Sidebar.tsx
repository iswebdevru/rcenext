import { className } from '@/shared/lib/ui';
import { PropsWithChildren } from 'react';

type RightSideMenuProps = {
  opened: boolean;
} & PropsWithChildren;

export default function Sidebar({ children, opened }: RightSideMenuProps) {
  return (
    <div
      className={className({
        'fixed top-0 h-full right-0 transition lg:static': true,
        'translate-x-full lg:translate-x-0': !opened,
        'translate-x-0': opened,
      })}
    >
      {children}
    </div>
  );
}
