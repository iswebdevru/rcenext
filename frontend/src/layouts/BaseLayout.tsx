import { PropsWithChildren } from 'react';
import { Header, HeaderProps } from '@/widgets/Header';

export type BaseLayout = HeaderProps & PropsWithChildren;

export function BaseLayout({ children, ...headerProps }: BaseLayout) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-14 flex-none">
        <Header {...headerProps} />
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
