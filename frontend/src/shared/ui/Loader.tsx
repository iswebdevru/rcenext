import { PropsWithChildren } from 'react';

export type LoaderWrapperProps = PropsWithChildren & {
  enabled: boolean;
};

export function LoaderWrapper({ children, enabled }: LoaderWrapperProps) {
  return (
    <div className="relative">
      <div className={enabled ? 'opacity-40 select-none' : ''}>{children}</div>
      {enabled ? (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-400 dark:border-blue-800 dark:border-t-blue-500"></div>
        </div>
      ) : null}
    </div>
  );
}

export function LoaderCircle() {
  return (
    <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500 dark:border-zinc-800 dark:border-t-zinc-700"></div>
  );
}

export function LoaderRect() {
  return (
    <div className="w-full h-full bg-zinc-200 animate-pulse dark:bg-zinc-700"></div>
  );
}
