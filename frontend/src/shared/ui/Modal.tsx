import { PropsWithChildren } from 'react';
import { TransitionStatus } from 'react-transition-state';
import { clsx } from '../lib/ui';

export type OverlayProps = {
  status: TransitionStatus;
} & PropsWithChildren;

/**
 * Add empty dark background
 */
export function Overlay({ children, status }: OverlayProps) {
  if (status === 'exited') {
    return null;
  }
  return (
    <div
      className={clsx({
        'fixed p-4 left-0 top-0 w-full h-full bg-black z-20 grid items-end justify-center md:items-center':
          true,
        'bg-opacity-0': status === 'preEnter',
        'bg-opacity-80 transition-colors': status === 'entering',
        'bg-opacity-80': status === 'entered',
        'bg-opacity-0 transition-colors': status === 'exiting',
      })}
    >
      {children}
    </div>
  );
}

export function Modal({ children, status }: OverlayProps) {
  if (status === 'exited') {
    return null;
  }
  return (
    <div
      className={clsx({
        'bg-white border border-zinc-200 dark:border-zinc-700 rounded-md dark:bg-zinc-800':
          true,
        'scale-90 opacity-0': status === 'preEnter',
        'scale-100 opacity-100 transition-[transform,opacity]':
          status === 'entering',
        'scale-100 opacity-100': status === 'entered',
        'scale-90 opacity-0 transition-[transform,opacity]':
          status === 'exiting',
      })}
    >
      {children}
    </div>
  );
}
