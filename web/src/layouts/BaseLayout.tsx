import { PropsWithChildren } from 'react';
import Header from '@/widgets/Header';

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
