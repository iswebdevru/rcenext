import { PropsWithChildren } from 'react';

export function Title({ children }: PropsWithChildren) {
  return (
    <h1 className="text-base font-bold text-zinc-700 dark:text-zinc-200">
      {children}
    </h1>
  );
}
