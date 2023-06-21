import { PropsWithChildren } from 'react';

export function Title({ children }: PropsWithChildren) {
  return (
    <h1 className="text-slate-700 font-bold text-lg dark:text-zinc-200">
      {children}
    </h1>
  );
}
