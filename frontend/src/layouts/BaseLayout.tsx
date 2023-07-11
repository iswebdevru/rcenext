import { PropsWithChildren } from 'react';
import Header, { HeaderProps } from '@/widgets/Header';

export type BaseLayout = HeaderProps & PropsWithChildren;

export function BaseLayout({ children, ...headerProps }: BaseLayout) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-shrink-0">
        <Header {...headerProps} />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
