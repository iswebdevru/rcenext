import { PropsWithChildren } from 'react';
import { Header } from '@/widgets/Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-14 flex-none">
        <Header />
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
