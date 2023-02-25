import Header from '@/widgets/header';
import { PropsWithChildren } from 'react';

export function BaseLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="grow">{children}</div>
    </div>
  );
}
